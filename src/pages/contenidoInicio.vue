<script>
import EssentialLink from "components/EssentialLink.vue";
import TarjetasCell from "src/components/TarjetasCell.vue";

import { defineComponent, ref, computed, onMounted, onBeforeMount } from "vue";

import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";

const group = ref([]);
const valorInicial = 0.0;
const valorFinal = 0.0;
const nuevo = ref(false);
const optionsUno = [
  { label: "Samsung 15", value: "sam" },
  { label: "Huawei 10", value: "hua" },
  { label: "Nokia 56", value: "noki" },
  { label: "iPhone 4", value: "phone" },
  { label: "Xiomi 4", value: "xiomi" },
];
const optionsDos = [
  { label: "Android 15", value: "an" },
  { label: "Windows 10", value: "win" },
  { label: "Ios 56", value: "ios" },
];
const optionsTres = [
  { label: "6.0", value: "seis" },
  { label: "5.5", value: "cincoPunto" },
  { label: "5", value: "cinco" },
];

export default {
  setup() {
    const anuncios = ref(null);

    onMounted(async () => {
      anuncios.value = await useCollection(collection(db, "anuncios")).value;
      console.log(anuncios.value);
      console.log(anuncios.value.length);
      console.log("Hola mundo");
    });
    return {
      drawer: ref(true),
      group,
      drawerSegundo: ref(false),
      current: ref(3),
      icon: ref(false),
      optionsUno,
      optionsDos,
      optionsTres,
      paginacion: ["4", "8", "12", "25"],
      nuevo,
      valorInicial,
      valorFinal,
      anuncios,
    };
  },
  computed: {
    esDispositivoMovil() {
      // Utiliza Quasar's $q.screen para detectar si es un dispositivo móvil
      return this.$q.screen.width <= 600; // Puedes ajustar este valor según tus necesidades
    },
  },
  data() {
    return {
      selectedOption: null,
      seleccionarPagina: null,
      prompt: false,
      dialog: ref(false),
      maximizedToggle: ref(true),
      optionsEleccion: ["Android", "Windows", "Ios"],
      opcion: "usado",
      marca: "",
      modelo: "",
      uploadedFiles: [],
      customFileList: [],
      selectedLabel: "Precio",
      onItemClick(option) {
        this.selectedLabel = option;
      },
    };
  },
  components: { TarjetasCell },
};
</script>
<template>
  <div class="row">
    <div class="col-2">
      <div class="q-pa-md gt-sm">
        <q-toggle v-model="nuevo"><strong>Nuevo</strong></q-toggle>
        <br />
        <fieldset
          style="
            border: 2px solid #000000;
            box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.5);
          "
        >
          <legend>Marca:</legend>
          <q-option-group
            :options="optionsUno"
            type="checkbox"
            v-model="group"
          />
        </fieldset>

        <fieldset
          style="
            border: 2px solid #000000;
            box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.5);
          "
        >
          <legend>Sistema:</legend>
          <q-option-group
            :options="optionsDos"
            type="checkbox"
            v-model="group"
          />
        </fieldset>
        <fieldset
          style="
            border: 2px solid #000000;
            box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.5);
          "
        >
          <legend>Pantalla:</legend>
          <q-option-group
            :options="optionsTres"
            type="checkbox"
            v-model="group"
          />
        </fieldset>
      </div>
    </div>

    <div class="col-12 col-md">
      <div class="row flex flex-center">
        <strong class="gt-sm">Precio:</strong>
        <div class="col-3 gt-sm">
          <q-input v-model="valorInicial">
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>
        <strong class="gt-sm">Hasta:</strong>

        <div class="col-3 gt-sm">
          <q-input v-model="valorFinal">
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>
        <div class="6 q-mr-xs"><strong>Ordenar por:</strong></div>
        <q-btn color="primary" class="q-mr-xs gt-sm">
          <q-icon left size="2em" name="arrow_upward" />
          <div>Precio</div>
        </q-btn>
        <q-btn
          color="primary"
          class="q-mr-xs gt-sm"
          label="Fecha"
          icon="query_builder"
        >
        </q-btn>
        <!--boton que contiene las opciones de ordenar-->
        <div class="q-pa-md lt-md">
          <q-btn-dropdown
            color="primary"
            :label="selectedLabel"
            dropdown-icon="change_history"
          >
            <q-list>
              <q-item clickable v-close-popup @click="onItemClick('Precio')">
                <q-item-section>
                  <q-item-label>Precio</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onItemClick('Fecha')">
                <q-item-section>
                  <q-item-label>Fecha</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <!--boton desplegable-->
        <q-btn
          color="primary"
          @click="drawerSegundo = !drawerSegundo"
          class="lt-md"
          icon="filter_alt"
          v-if="esDispositivoMovil"
        />
      </div>
      <div class="col-12 col-md">
        <br />
        <!--aqui-->
        <tarjetas-cell :anuncios="anuncios"></tarjetas-cell>

        <!--codigo de los numeros de abajo-->
        <div class="q-pa-lg flex flex-center">
          <div class="q-pa-lg flex flex-center">
            <q-pagination v-model="current" :max="8" direction-links />
          </div>
          <center class="gt-sm">Articulos por pagina:</center>
          <q-select
            transition-show="scale"
            transition-hide="scale"
            filled
            v-model="seleccionarPagina"
            :options="paginacion"
            style="width: 8%"
            @keyup.enter="prompt = false"
            class="gt-sm"
          />
        </div>
      </div>
    </div>
  </div>
  <!--codigo de la emergente-->

  <q-drawer
    v-model="drawerSegundo"
    show-if-above
    :width="220"
    v-if="esDispositivoMovil"
    :breakpoint="700"
    elevated
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    side="right"
  >
    <q-toggle v-model="nuevo"><strong>Nuevo</strong></q-toggle>
    <br />
    <fieldset
      style="
        border: 2px solid #000000;
        box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.5);
      "
    >
      <legend>Marca:</legend>
      <q-option-group :options="optionsUno" type="checkbox" v-model="group" />
    </fieldset>

    <fieldset
      style="
        border: 2px solid #000000;
        box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.5);
      "
    >
      <legend>Sistema:</legend>
      <q-option-group :options="optionsDos" type="checkbox" v-model="group" />
    </fieldset>
    <fieldset
      style="
        border: 2px solid #000000;
        box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.5);
      "
    >
      <legend>Pantalla:</legend>
      <q-option-group :options="optionsTres" type="checkbox" v-model="group" />
    </fieldset>
  </q-drawer>
  <router-view />
</template>
