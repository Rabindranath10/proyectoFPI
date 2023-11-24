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

import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeMount,
  watch,
} from "vue";

import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";

const group = ref([]);
const selectedBrands = ref([]);
const selectedSystems = ref([]);
const selectedScreens = ref([]);
const ordenarPrecio = ref(false);
const ordenarPorFecha = ref(false);
const valorInicial = ref();
const valorFinal = ref();
const nuevo = ref(false);
const usado = ref(false);
const paginacion = ref();

const actual = ref(1);
const elementosPorPagina = ref([4, 8, 12, 25]);
const cuantosArticulos = ref(4);
const datosPaginados = ref([]);

const optionsUno = [
  { label: "Samsung 15", value: "samsung" },
  { label: "Huawei 10", value: "huawei" },
  { label: "Nokia 56", value: "nokia" },
  { label: "iPhone 4", value: "iPhone" },
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
function recargarPagina() {
  return window.location.reload();
}

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
      if (usado.value) {
        filteredAnuncios = filteredAnuncios.filter(
          (anuncio) => anuncio.estado.toLowerCase() === "usado"
        );
      }

      // Para los precios inicial y final
      if (valorInicial.value && valorFinal.value) {
        filteredAnuncios = filteredAnuncios.filter((anuncio) => {
          const precioAnuncio = parseFloat(anuncio.precio); // Convierte el precio del anuncio a número
          return (
            precioAnuncio >= parseFloat(valorInicial.value) &&
            precioAnuncio <= parseFloat(valorFinal.value)
          );
        });
      }
      if (ordenarPrecio.value) {
        filteredAnuncios.sort((a, b) => b.precio - a.precio);
      }
      if (ordenarPorFecha.value) {
        filteredAnuncios.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      }

      return filteredAnuncios;
    });

    watch(
      () => anunciosFiltrados.value,
      () => obtenerDataPagina(1)
    );

    const toggleOrdenarPorPrecio = () => {
      ordenarPrecio.value = !ordenarPrecio.value; // Cambia el valor de la bandera
    };
    const toggleOrdenarPorFecha = () => {
      ordenarPorFecha.value = !ordenarPorFecha.value; // Cambia el valor de la bandera
    };
    function paginas(cuantosArticulos) {
      if (cuantosArticulos == elementosPorPagina.value[0]) {
        return Math.ceil(anuncios.value.length / elementosPorPagina.value[0]);
      } else if (cuantosArticulos == elementosPorPagina.value[1]) {
        return Math.ceil(anuncios.value.length / elementosPorPagina.value[1]);
      } else if (cuantosArticulos == elementosPorPagina.value[2]) {
        return Math.ceil(anuncios.value.length / elementosPorPagina.value[2]);
      }
    }

    function obtenerDataPagina(nPagina) {
      console.log(nPagina);

      datosPaginados.value = [];
      let init;
      let fin;
      if (cuantosArticulos.value == elementosPorPagina.value[0]) {
        init =
          nPagina * elementosPorPagina.value[0] - elementosPorPagina.value[0];
        fin = nPagina * elementosPorPagina.value[0];
      } else if (cuantosArticulos.value == elementosPorPagina.value[1]) {
        init =
          nPagina * elementosPorPagina.value[1] - elementosPorPagina.value[1];
        fin = nPagina * elementosPorPagina.value[1];
      } else if (cuantosArticulos.value == elementosPorPagina.value[2]) {
        init =
          nPagina * elementosPorPagina.value[2] - elementosPorPagina.value[2];
        fin = nPagina * elementosPorPagina.value[2];
      }

      datosPaginados.value = anunciosFiltrados.value.slice(init, fin);
    }
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
      usado,
      valorInicial,
      valorFinal,
      anuncios,
      anunciosFiltrados,
      selectedBrands,
      selectedSystems,
      selectedScreens,
      toggleOrdenarPorPrecio,
      toggleOrdenarPorFecha,
      recargarPagina,
      actual,
      elementosPorPagina,
      cuantosArticulos,
      datosPaginados,
      obtenerDataPagina,
      paginas,
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
        <q-toggle v-model="usado"><strong>Usado</strong></q-toggle>
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
        <br />
        <q-btn
          color="primary"
          class="q-mr-xs gt-sm"
          label="Limpiar filtros"
          icon="cleaning_services"
          @click="recargarPagina"
        >
        </q-btn>
      </div>
    </div>

    <div class="col-12 col-md">
      <div class="row flex flex-center">
        <strong class="gt-sm">Precio:</strong>
        <div class="col-3 gt-sm">
          <q-input v-model="valorInicial" type="number">
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>
        <strong class="gt-sm">Hasta:</strong>

        <div class="col-3 gt-sm">
          <q-input v-model="valorFinal" type="number">
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>
        <div class="6 q-mr-xs"><strong>Ordenar por:</strong></div>
        <q-btn
          color="primary"
          class="q-mr-xs gt-sm"
          @click="toggleOrdenarPorPrecio"
          label="Precio"
          icon="arrow_upward"
        >
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
                  <q-item-label @click="toggleOrdenarPorPrecio"
                    >Precio</q-item-label
                  >
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
        <tarjetas-cell :anuncios="datosPaginados"></tarjetas-cell>

        <!--codigo de los numeros de abajo-->
        <div class="row">
          <div class="col">
            <q-pagination
              v-model="actual"
              @click="obtenerDataPagina(actual)"
              :max="paginas(cuantosArticulos)"
              direction-links
              gutter="20px"
              class="q-mt-md"
            />
          </div>
          <div class="col gt-sm">
            <div class="q-pa-md row items-start q-gutter-md">
              <label>Articulos por página</label>
              <q-select
                outlined
                v-model="cuantosArticulos"
                class="inputSmaller"
                :options="elementosPorPagina"
                @update:model-value="obtenerDataPagina(actual)"
              ></q-select>
            </div>
          </div>
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
    <q-toggle v-model="usado"><strong>Usado</strong></q-toggle>
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
    <br />
    <center>
      <q-btn
        color="primary"
        label="Limpiar filtros"
        icon="cleaning_services"
        @click="recargarPagina"
      >
      </q-btn>
    </center>
  </q-drawer>
  <router-view />
</template>
