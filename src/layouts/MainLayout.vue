<script setup>
import { defineComponent, ref, computed, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import TarjetasCell from "src/components/TarjetasCell.vue";
import { useRouter } from "vue-router";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

const group = ref([]);
const estadoRef = ref(null);
const marcaRef = ref(null);
const modeloRef = ref(null);
const pantallaRef = ref(null);
const sistemaRef = ref(null);
const romRef = ref(null);
const ramRef = ref(null);
const imagenesURL = ref(null);
const tituloRef = ref(null);
const vendedorRef = ref(null);
const telefonoRef = ref(null);
const descripcionRef = ref(null);
const precioRef = ref(null);
const dialog = ref(false);
const maximizedToggle = ref(true);
const slide = ref(1);
const drawer = ref(false);
const selectedOption = ref(null);
const options = ref(["Android", "Windows", "Ios"]);
const opcionesSistema = ref(["Android", "Windows", "Ios"]);
const uploadedFiles = ref([]);
const customFileList = [];

const nuevoAnuncio = ref({
  estado: "",
  marcaTelefono: "",
  modelo: "",
  pantalla: 0.0,
  sistema: "",
  rom: 0.0,
  ram: 0.0,
  imagenesURL: "",
  titulo: "",
  vendedor: "",
  telefono: 0.0,
  descripcion: "",
  precio: 0.0,
});

const persistent = ref(false);

// Función para navegar a la página de detalles
const navegarInicio = () => {
  // Utiliza el método push de Vue Router para navegar a la página deseada
  router.push("/");
};
//en proceso las paginas
const paginasfaltantes = () => {
  // Utiliza el método push de Vue Router para navegar a la página deseada
  router.push("/proceso");
};

const esDispositivoMovil = computed(() => {
  // Utiliza Quasar's $q.screen para detectar si es un dispositivo móvil
  return $q.screen.width <= 600; // Puedes ajustar este valor según tus necesidades
});

const agregarAnuncio = async () => {
  console.log("Agregando anuncio");
  try {
    const docRef = await addDoc(collection(db, "anuncios"), nuevoAnuncio.value);
    console.log("Document written with ID: ", docRef.id);
    window.location.reload();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <div>
          <q-btn
            v-if="esDispositivoMovil"
            flat
            @click="drawer = !drawer"
            round
            dense
            icon="store"
          ></q-btn>
          <q-btn flat round dense icon="store" class="gt-sm"></q-btn>
        </div>
        <q-toolbar-title class="gt-sm">
          <strong>Tienda Cell Phone</strong>
          <div></div>
        </q-toolbar-title>
        <q-space />

        <q-input
          color="black"
          filled
          v-model="text"
          label="Buscar"
          style="width: 430px; background-color: #fdffff"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn
              @click="clearSearch"
              icon="clear"
              flat
              style="width: 50px"
              class="q-pa-md"
            />
          </template>
        </q-input>

        <div class="q-pa-md q-gutter-sm gt-sm">
          <q-btn
            color="secondary"
            icon="home"
            label="Inicio"
            @click="navegarInicio"
          />
          <q-btn
            color="secondary"
            icon="leaderboard"
            label="Estadisticas"
            @click="paginasfaltantes"
          />
          <q-btn
            color="secondary"
            icon="add_circle_outline"
            @click="dialog = true"
          />

          <q-btn
            icon="shopping_cart"
            color="secondary"
            @click="paginasfaltantes"
          >
            <q-badge color="red" floating transparent> 0 </q-badge>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <!--parte del drawer-->
    <q-drawer
      v-model="drawer"
      :width="200"
      v-if="esDispositivoMovil"
      :breakpoint="500"
      overlay
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>

          <q-item-section><strong>Tienda CellPhone</strong></q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navegarInicio">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section><strong>Inicio</strong></q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>

          <q-item-section @click="dialog = true"
            ><strong>Nuevo Anuncio</strong></q-item-section
          >
        </q-item>

        <q-item clickable v-ripple @click="paginasfaltantes">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>

          <q-item-section><strong>Carrito</strong></q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="paginasfaltantes">
          <q-item-section avatar>
            <q-icon name="leaderboard" />
          </q-item-section>

          <q-item-section><strong>Estadisticas</strong></q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!--container principal-->
    <q-page-container>
      <!-- {{ anuncios }} -->
      <router-view />
    </q-page-container>
    <q-footer>
      <q-toolbar>
        <q-toolbar-title>
          <div></div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="text-black">
        <q-bar class="bg-secondary">
          <q-space />

          <q-btn
            dense
            flat
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">NUEVO ANUNCIO</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col-md-6 col-12">
              <!--codigo para telefono en dispositivo android-->
              <q-carousel
                swipeable
                animated
                v-model="slide"
                thumbnails
                infinite
                class="lt-md"
                style="height: 200px"
              >
                <q-carousel-slide
                  :name="1"
                  img-src="https://cdn.quasar.dev/img/mountains.jpg"
                />
                <q-carousel-slide
                  :name="2"
                  img-src="https://cdn.quasar.dev/img/parallax1.jpg"
                />
                <q-carousel-slide
                  :name="3"
                  img-src="https://cdn.quasar.dev/img/parallax2.jpg"
                />
                <q-carousel-slide
                  :name="4"
                  img-src="https://cdn.quasar.dev/img/quasar.jpg"
                />
              </q-carousel>
              <br />

              <center>
                <q-btn
                  round
                  color="green"
                  icon="add_circle_outline"
                  class="lt-md"
                />
              </center>
              <p></p>

              <br />
              <div class="q-gutter-sm lt-md">
                <q-input v-model="titulo" label="Titulo" outlined dense />
                <center>
                  <q-input
                    v-model="precio"
                    label="Precio"
                    outlined
                    dense
                    style="width: 120px"
                  />
                </center>

                <div class="row">
                  <div class="col">
                    <q-input
                      v-model="vendedor"
                      label="Vendedor"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="telefono"
                      label="Telefono"
                      outlined
                      dense
                    />
                  </div>
                </div>
              </div>
              <br />
              <!-- Primera columna -->
              <fieldset style="border: 2px solid #000000">
                <div class="q-gutter-sm">
                  <div style="justify-content: center; align-items: center">
                    Estado:
                    <q-radio
                      v-model="nuevoAnuncio.estado"
                      val="nuevo"
                      label="Nuevo"
                      outlined
                      dense
                      class="q-mx-md"
                    />
                    <q-radio
                      v-model="nuevoAnuncio.estado"
                      val="usado"
                      label="Usado"
                      outlined
                      dense
                    />
                  </div>
                </div>
                <br />
                <div class="q-gutter-sm">
                  <div class="row">
                    <div
                      class="col-2 col-md-2"
                      style="
                        display: flex;

                        align-items: center;
                      "
                    >
                      Marca:
                    </div>
                    <div class="col-10 col-md-10">
                      <q-input
                        v-model="nuevoAnuncio.marcaTelefono"
                        outlined
                        dense
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class="col-2 col-md-2"
                      style="
                        display: flex;

                        align-items: center;
                      "
                    >
                      Modelo:
                    </div>
                    <div class="col-10 col-md-10">
                      <q-input v-model="nuevoAnuncio.modelo" outlined dense />
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class="col-2 col-md-1.5"
                      style="
                        display: flex;

                        align-items: center;
                      "
                    >
                      Pantalla:
                    </div>
                    <div class="col-10 col-md-10.5">
                      <q-input
                        v-model="nuevoAnuncio.pantalla"
                        outlined
                        dense
                        suffix="Pulgadas"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class="col-2 col-md-1.5"
                      style="
                        display: flex;

                        align-items: center;
                      "
                    >
                      Sistema:
                    </div>
                    <div class="col-10 col-md-10.5">
                      <q-select
                        transition-show="scale"
                        transition-hide="scale"
                        filled
                        v-model="nuevoAnuncio.sistema"
                        :options="opcionesSistema"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class="col-2 col-md-2"
                      style="display: flex; align-items: center"
                    >
                      Rom:
                    </div>
                    <div class="col-10 col-md-6">
                      <q-input
                        v-model="nuevoAnuncio.rom"
                        outlined
                        dense
                        suffix="GB"
                      />
                    </div>
                    <div
                      class="col-4 gt-sm"
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      Almacenamiento interno
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class="col-2 col-md-1.5"
                      style="
                        display: flex;

                        align-items: center;
                      "
                    >
                      Ram:
                    </div>
                    <div class="col-10 col-md-10.5">
                      <q-input
                        v-model="nuevoAnuncio.ram"
                        outlined
                        dense
                        suffix="GB"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset style="border: 2px solid #000000" class="gt-sm">
                <legend>Imagenes</legend>
                <div class="row">
                  <div class="col-2">
                    <q-btn
                      round
                      color="green"
                      icon="add_circle_outline"
                      v-model="nuevoAnuncio.imagenesURL"
                    />
                    <br />
                    <br />
                    <q-btn round color="green" icon="remove" />
                  </div>
                  <div class="col-5">
                    <q-markup-table>
                      <thead>
                        <tr>
                          <th class="text-left">N</th>
                          <th class="text-right">Tamaño</th>
                          <th class="text-right">Tipo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-left">1</td>
                          <td class="text-right">145 kb</td>
                          <td class="text-right">jpg</td>
                        </tr>
                        <tr>
                          <td class="text-left">2</td>
                          <td class="text-right">145 kb</td>
                          <td class="text-right">png</td>
                        </tr>
                        <tr>
                          <td class="text-left">3</td>
                          <td class="text-right">145 kb</td>
                          <td class="text-right">png</td>
                        </tr>
                        <tr>
                          <td class="text-left">4</td>
                          <td class="text-right">145 kb</td>
                          <td class="text-right">jpg</td>
                        </tr>
                      </tbody>
                    </q-markup-table>
                  </div>
                  <div class="col-5">
                    <q-carousel
                      animated
                      v-model="slide"
                      navigation
                      infinite
                      :autoplay="autoplay"
                      arrows
                      transition-prev="slide-right"
                      transition-next="slide-left"
                      @mouseenter="autoplay = false"
                      @mouseleave="autoplay = true"
                      style="width: 90%; height: 240px"
                      class="q-mx-md"
                    >
                      <q-carousel-slide
                        :name="1"
                        img-src="https://cdn.quasar.dev/img/mountains.jpg"
                      />
                      <q-carousel-slide
                        :name="2"
                        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
                      />
                      <q-carousel-slide
                        :name="3"
                        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
                      />
                      <q-carousel-slide
                        :name="4"
                        img-src="https://cdn.quasar.dev/img/quasar.jpg"
                      />
                    </q-carousel>
                  </div>
                </div>
              </fieldset>
            </div>

            <div class="col-md-6 col-12 gt-sm">
              <!-- Segunda columna -->
              <br /><br /><br /><br />
              <fieldset>
                <div class="q-gutter-sm">
                  <div>
                    Titulo Breve del Anuncio
                    <p></p>
                    <q-input v-model="nuevoAnuncio.titulo" outlined dense />
                  </div>
                  <div class="row">
                    <div
                      class="col-2"
                      style="
                        display: flex;

                        align-items: center;
                      "
                    >
                      Vendedor:
                    </div>
                    <div class="col-10">
                      <q-input v-model="nuevoAnuncio.vendedor" outlined dense />
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class="col-2"
                      style="
                        display: flex;

                        align-items: center;
                      "
                    >
                      Teléfono:
                    </div>
                    <div class="col-10">
                      <q-input v-model="nuevoAnuncio.telefono" outlined dense />
                    </div>
                  </div>
                  <div>
                    Descripción
                    <p></p>
                    <q-input
                      v-model="nuevoAnuncio.descripcion"
                      outlined
                      dense
                      type="textarea"
                    />
                  </div>
                  <fieldset
                    style="
                      width: 25%;
                      margin: 0 auto;
                      text-align: center;
                      border: 2px solid #000000;
                    "
                  >
                    <legend>Precio</legend>
                    <q-input
                      v-model="nuevoAnuncio.precio"
                      suffix="$"
                      outlined
                      dense
                      style="width: 100%"
                    />
                  </fieldset>
                </div>
              </fieldset>
              <q-card-actions align="center" class="text-primary">
                <q-btn
                  label="Cancelar"
                  v-close-popup
                  icon="highlight_off"
                  color="green"
                />
                <q-btn
                  label="Crear"
                  @click="persistent = true"
                  icon="save_as"
                  color="green"
                />
                <q-dialog
                  v-model="persistent"
                  persistent
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-card class="bg-teal text-white" style="width: 400px">
                    <q-card-section>
                      <div class="text-h6">
                        <center>
                          <q-icon name="done" size="6rem" />
                        </center>
                      </div>
                    </q-card-section>

                    <q-card-section class="q-pt-none" align="center">
                      <h4>¡Guardado!</h4>
                      <p>Datos guardados con exito</p>
                    </q-card-section>

                    <q-card-actions align="center" class="bg-white text-teal">
                      <center>
                        <q-btn
                          flat
                          label="Listo"
                          v-close-popup
                          @click="agregarAnuncio"
                        >
                        </q-btn>
                      </center>
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-card-actions>
            </div>

            <!-- codigo de la version movil -->
            <div class="col-md-6 col-12 lt-md">
              <fieldset style="border: 2px solid #000000">
                <q-input
                  v-model="descripcion"
                  label="Descripcion"
                  outlined
                  dense
                  type="textarea"
                />
              </fieldset>
              <q-card-actions align="center" class="text-primary">
                <q-btn
                  label="Cancelar"
                  v-close-popup
                  icon="highlight_off"
                  color="green"
                />
                <q-btn label="Crear" icon="save_as" color="green" />
              </q-card-actions>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<!-- <script>
import { defineComponent, ref, computed, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import TarjetasCell from "src/components/TarjetasCell.vue";
import { useRouter } from "vue-router";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";
import { useQuasar } from "quasar";

const group = ref([]);
const nuevoAnuncio = ref({
  marcaTelefono: "",
  modelo: "",
  pantalla: 0.0
  sistema: "",
  rom: 0.0,
  ram: 0.0,
  imagenesURL: "",
  titulo: "",
  vendedor: "",
  telefono: 0.0,
  descripcion: "",
  precio: 0.0,
});
const estadoRef = ref(null);
const marcaRef = ref(null);
const modeloRef = ref(null);
const pantallaRef = ref(null);
const sistemaRef = ref(null);
const romRef = ref(null);
const ramRef = ref(null);
const imagenesURL = ref(null);
const tituloRef = ref(null);
const vendedorRef = ref(null);
const telefonoRef = ref(null);
const descripcionRef = ref(null);
const precioRef = ref(null);

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const anuncios = ref(null);

    // Función para navegar a la página de detalles
    const navegarInicio = () => {
      // Utiliza el método push de Vue Router para navegar a la página deseada
      router.push("/");
    };
    //en proceso las paginas
    const paginasfaltantes = () => {
      // Utiliza el método push de Vue Router para navegar a la página deseada
      router.push("/proceso");
    };
    //esto es un hook!!!!
    // onMounted(async () => {
    //   anuncios.value = await useCollection(collection(db, "anuncios")).value;
    //   console.log(anuncios.value);
    //   console.log(anuncios.value.length);
    //   console.log("Hola mundo");
    // });
    return {
      drawer: ref(false),
      group,
      dialog: ref(false),
      navegarInicio,
      maximizedToggle: ref(true),
      paginasfaltantes,
      slide: ref(1),
      nuevoAnuncio,
      agregarAnuncio,
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
      options: ["Android", "Windows", "Ios"],
      opcionesSistema: ["Android", "Windows", "Ios"],
      uploadedFiles: [],
      customFileList: [],
    };
  },
};
async function agregarAnuncio() {
  console.log("Agregando anuncio");
  try {
    const docRef = await addDoc(collection(db, "anuncios"), nuevoAnuncio.value);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function leerDatos() {}
</script> -->
