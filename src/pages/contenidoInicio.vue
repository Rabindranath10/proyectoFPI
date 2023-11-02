<!-- <script setup>
import EssentialLink from "components/EssentialLink.vue";
import TarjetasCell from "src/components/TarjetasCell.vue";
import { defineComponent, ref, computed, onMounted, onBeforeMount } from "vue";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";
import { useQuasar } from "quasar";

const group = ref([]);
const valorInicial = 0.0;
const valorFinal = 0.0;
const nuevo = ref(false);
const $q = useQuasar();
const optionsUno = ref([
  { label: "Samsung 15", value: "sam" },
  { label: "Huawei 10", value: "hua" },
  { label: "Nokia 56", value: "noki" },
  { label: "iPhone 4", value: "phone" },
  { label: "Xiomi 4", value: "xioami" },
]);
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

const anuncios = useCollection(collection(db, "anuncios"));
const anunciosFiltrados = ref([]);
const drawer = ref(true);
const drawerSegundo = ref(false);
const current = ref(3);
const icon = ref(false);
const paginacion = [4, 8, 12, 25];
const seleccionarPagina = ref(12);
const dialog = ref(false);
const maximizedToggle = ref(true);
const optionsEleccion = ["Android", "Windows", "Ios"];
const opcion = "usado";
const marca = "";
const modelo = "";
const uploadedFiles = [];
const customFileList = [];
const selectedLabel = "Precio";
const esDispositivoMovil = computed(() => {
  // Utiliza Quasar's $q.screen para detectar si es un dispositivo móvil
  return $q.screen.width <= 600; // Puedes ajustar este valor según tus necesidades
});

onMounted(async () => {
  console.log("onMounted");
  setTimeout(() => {
    anunciosFiltrados.value = [...anuncios.value];
    setMarcaFilters();
  }, 1000);
});

const setMarcaFilters = async () => {
  const anunciosC = await obtenerAnuncios();
  const marcas = anunciosC.map((anuncio) => anuncio.marcaTelefono);
  const marcasUnicas = [...new Set(marcas)];
  optionsUno.value = marcasUnicas.map((marca) => {
    return { label: marca, value: marca };
  });
};

const onItemClick = (option) => {
  selectedLabel = option;
};

const obtenerAnuncios = async () => {
  return [...anuncios.value];
};

const filtrarPorMarca = async () => {
  // console.log(obtenerAnuncios());
  const filtros = group.value;

  console.log(filtros.length);

  if (filtros.length == 0) {
    anunciosFiltrados.value = await obtenerAnuncios();
    return;
  }

  const anunciosC = await obtenerAnuncios();

  anunciosFiltrados.value = anunciosC.filter((anuncio) => {
    return filtros.includes(anuncio.marcaTelefono);
  });
};
</script>-->

<script>
import EssentialLink from "components/EssentialLink.vue";
import TarjetasCell from "src/components/TarjetasCell.vue";

import { defineComponent, ref, computed, onMounted, onBeforeMount } from "vue";

import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";

const group = ref([]);
const selectedBrands = ref([]);
const selectedSystems = ref([]);
const selectedScreens = ref([]);
const valorInicial = ref();
const valorFinal = ref();
const nuevo = ref(false);
const optionsUno = [
  { label: "Samsung 15", value: "samsung" },
  { label: "Huawei 10", value: "huawei" },
  { label: "Nokia 56", value: "nokia" },
  { label: "iPhone 4", value: "iphone" },
  { label: "Xiaomi 4", value: "xiaomi" },
];
const optionsDos = [
  { label: "Android 15", value: "Android" },
  { label: "Windows", value: "Windows" },
  { label: "Ios 56", value: "Ios" },
];
const optionsTres = [
  { label: "6.0", value: "6.0" },
  { label: "5.5", value: "5.5" },
  { label: "5.0", value: "5.0" },
];

export default {
  setup() {
    const anuncios = ref([]);

    onMounted(async () => {
      const querySnapshot = await getDocs(collection(db, "anuncios"));
      anuncios.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });

    // Filtros
    const anunciosFiltrados = computed(() => {
      let filteredAnuncios = anuncios.value;

      if (selectedBrands.value.length > 0) {
        // Filtro por marca
        filteredAnuncios = filteredAnuncios.filter((anuncio) =>
          selectedBrands.value.some(
            (selectedBrand) =>
              anuncio.marcaTelefono.toLowerCase().trim() ===
              selectedBrand.toLowerCase().trim()
          )
        );
        //console.log("Marca filtrados:", filteredAnuncios);
      }
      if (selectedSystems.value.length > 0) {
        // Filtro por sistema operativo
        filteredAnuncios = filteredAnuncios.filter((anuncio) =>
          selectedSystems.value.some(
            (selectedSystem) =>
              anuncio.sistema.toLowerCase().trim() ===
              selectedSystem.toLowerCase().trim()
          )
        );
      }

      if (selectedScreens.value.length > 0) {
        // Filtro por tamaño de pantalla
        filteredAnuncios = filteredAnuncios.filter((anuncio) => {
          return selectedScreens.value.some((selectedScreen) => {
            const formatNumber = (num) => {
              if (typeof num === "string") {
                return num.replace(/\.0+$/, "");
              }
              return num;
            };
            return (
              formatNumber(anuncio.pantalla) === formatNumber(selectedScreen)
            );
          });
        });
      }
      //Si el dispositivo es nuevo
      if (nuevo.value) {
        filteredAnuncios = filteredAnuncios.filter(
          (anuncio) => anuncio.estado.toLowerCase() === "nuevo"
        );
      }

      return filteredAnuncios;
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
      anunciosFiltrados,
      selectedBrands,
      selectedSystems,
      selectedScreens,
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
            v-model="selectedBrands"
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
            v-model="selectedSystems"
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
            v-model="selectedScreens"
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
        <tarjetas-cell :anuncios="anunciosFiltrados"></tarjetas-cell>

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
      <q-option-group
        :options="optionsUno"
        type="checkbox"
        v-model="selectedBrands"
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
        v-model="selectedSystems"
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
        v-model="selectedScreens"
      />
    </fieldset>
  </q-drawer>
  <router-view />
</template>
