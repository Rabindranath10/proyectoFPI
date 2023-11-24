<script setup>
import { defineComponent, ref, computed, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import TarjetasCell from "src/components/TarjetasCell.vue";
import { collection, addDoc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";
import { useQuasar } from "quasar";
import { data } from "autoprefixer";
import { useRouter } from "vue-router";
import {
  getStorage,
  ref as ref2,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";

const $q = useQuasar();
const router = useRouter();

const group = ref([]);
//variables para validaciones
const estadoRef = ref(null);
const marcaRef = ref(null);
const modeloRef = ref(null);
const pantallaRef = ref(null);
const sistemaRef = ref(null);
const romRef = ref(null);
const ramRef = ref(null);
const imagenesURL = ref([]);
const tituloRef = ref(null);
const vendedorRef = ref(null);
const telefonoRef = ref(null);
const descripcionRef = ref(null);
const precioRef = ref(null);
const fechaRef = ref(null);
const dialog = ref(false);
const maximizedToggle = ref(true);
const slide = ref(1);
const drawer = ref(false);
const selectedOption = ref(null);
const options = ref(["Android", "Windows", "Ios"]);
const opcionesSistema = ref(["Android", "Windows", "Ios"]);
const uploadedFiles = ref([]);
const customFileList = [];
const fotos = ref(null);
const fotosURL = ref([]);
const idAnuncio = ref("");
const inputRef = ref(null);
const nuevoAnuncio = ref({
  id: "",
  estado: "",
  marcaTelefono: "",
  modelo: "",
  pantalla: 0.0,
  sistema: "",
  rom: 0.0,
  ram: 0.0,
  imagenesURL: [],
  titulo: "",
  vendedor: "",
  telefono: 0.0,
  descripcion: "",
  precio: 0.0,
});

const persistent = ref(false);
const validarFormulario = computed(() => {
  if (
    !nuevoAnuncio.value.estado ||
    !nuevoAnuncio.value.marcaTelefono ||
    !nuevoAnuncio.value.marcaTelefono ||
    !nuevoAnuncio.value.modelo ||
    !nuevoAnuncio.value.pantalla ||
    !nuevoAnuncio.value.sistema ||
    !nuevoAnuncio.value.rom ||
    !nuevoAnuncio.value.ram ||
    !nuevoAnuncio.value.imagenesURL ||
    !nuevoAnuncio.value.titulo ||
    !nuevoAnuncio.value.vendedor ||
    !nuevoAnuncio.value.telefono ||
    !nuevoAnuncio.value.descripcion ||
    nuevoAnuncio.value.precio == 0
  ) {
    return false;
  }
  return true;
});
/*
const agregarImagen = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.addEventListener("change", (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        nuevoAnuncio.value.imagenesURL.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
  input.click(); // Abre el campo de entrada de archivo
};
const quitarImagen = (index) => {
  nuevoAnuncio.value.imagenesURL.splice(index, 1);
};
*/

const subirImagenes = function () {
  const storage = getStorage();
  const promises = [];

  fotos.value.forEach((foto) => {
    const storageRef = ref2(storage, idAnuncio.value + "/" + foto.name);
    //Se inicia con la subida de la imagen
    const uploadTask = uploadBytes(storageRef, foto);

    promises.push(
      new Promise((resolve) => {
        uploadTask
          .then((snapshot) => {
            //Se obtiene la URL de la imagen desde el storage para poder agregarla al documento (anuncio)
            getDownloadURL(snapshot.ref).then((url) => {
              imagenesURL.value.push(url);
              console.log("Imagen subida: ", url);
              resolve();
            });
          })
          .catch((error) => {
            console.error("Error al subir imagen: ", error);
            resolve();
          });
      })
    );
  });

  return Promise.all(promises);
};

function obtenerURL() {
  if (fotos.value) {
    fotos.value.forEach((element) => {
      fotosURL.value.push(URL.createObjectURL(element));
    });
  }
}
function vaciar(index) {
  fotosURL.value.splice(0, fotosURL.value.length);
}
function limpiarCampos() {
  vaciar(),
    (nuevoAnuncio.value = {
      id: "",
      estado: "",
      marcaTelefono: "",
      modelo: "",
      pantalla: 0.0,
      sistema: "",
      rom: 0.0,
      ram: 0.0,
      imagenesURL: [],
      titulo: "",
      vendedor: "",
      telefono: 0.0,
      descripcion: "",
      precio: 0.0,
    });
}
function eliminarFotos() {
  if (fotos.value) {
    fotos.value.forEach((element) => {
      fotosURL.value.pop();
      fotos.value = null;
    });
  }
}
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
//funcion para ir a estadisticas
const navegarEstadisticas = () => {
  // Utiliza el método push de Vue Router para navegar a la página deseada
  router.push("/estadisticas");
};
//buscar palabras

const esDispositivoMovil = computed(() => {
  // Utiliza Quasar's $q.screen para detectar si es un dispositivo móvil
  return $q.screen.width <= 600; // Puedes ajustar este valor según tus necesidades
});

const agregarAnuncio = async () => {
  console.log("Agregando anuncio...");
  try {
    const docRef = await addDoc(collection(db, "anuncios"), nuevoAnuncio.value);
    // Aqui se asigna el id para el manejo de imágenes
    nuevoAnuncio.value.id = docRef.id;
    idAnuncio.value = docRef.id;

    // Subir imágenes y obtener URL
    await subirImagenes();

    // Agregar las URL de las imágenes a nuevoAnuncio.imagenesURL
    nuevoAnuncio.value.imagenesURL = imagenesURL.value;

    // Actualizar el documento con las URLs de las imágenes
    await setDoc(docRef, nuevoAnuncio.value);

    console.log("Documento escrito con ID: ", docRef.id);
    $q.notify({
      color: "green-5",
      textColor: "white",
      icon: "cloud_done",
      message: "Anuncio creado satisfactoriamente",
    });

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } catch (e) {
    console.error("Error al agregar el documento: ", e);
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
          @click="buscarPalabras"
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
            @click="navegarEstadisticas"
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

        <q-item clickable v-ripple @click="navegarEstadisticas">
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
        <q-toolbar-title
          class="text-center q-mb-sm items-center justify-center gt-sm"
        >
          <div class="row">
            <div class="col">Kendall Cárcamo</div>
            <div class="col">Italo Rabindranath Cárcamo</div>
            <div class="col">Gabriela Hernández</div>
          </div>
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
          <center><div class="text-h6">NUEVO ANUNCIO</div></center>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col-md-6 col-12">
              <!--codigo para telefono en dispositivo android-->
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
                class="q-mx-md lt-md"
              >
                <q-carousel-slide
                  v-for="(img, id) in fotosURL"
                  :key="id"
                  :name="id + 1"
                  :img-src="img"
                />
              </q-carousel>
              <br />
              <!--//boton para agregar-->
              <center>
                <q-file
                  v-model="fotos"
                  class="lt-md"
                  filled
                  multiple
                  style="width: 50px; height: 50px; overflow: hidden"
                  accept=".jpg, image/*"
                  @update:model-value="obtenerURL"
                >
                  <q-icon
                    color="green"
                    name="add_circle"
                    style="font-size: 40px; margin: 5px -8px"
                  >
                  </q-icon>
                </q-file>
              </center>
              <p></p>
              <br />
              <center>
                <div class="q-gutter-sm lt-md">
                  <q-input
                    v-model="nuevoAnuncio.titulo"
                    label="Titulo"
                    outlined
                    dense
                    :rules="[(val) => !!val || 'Este campo es requerido']"
                    ref="tituloRef"
                  />

                  <q-input
                    v-model="nuevoAnuncio.precio"
                    label="Precio"
                    outlined
                    dense
                    type="number"
                    style="width: 120px"
                    ref="precioRef"
                    :rules="[
                      (val) =>
                        (val !== null && val !== '') ||
                        'Este campo es obligatorio',
                      (val) => val > 0 || 'Ingresa un numero real',
                    ]"
                  />

                  <div class="row">
                    <div class="col">
                      <q-input
                        v-model="nuevoAnuncio.vendedor"
                        label="Vendedor"
                        outlined
                        dense
                        :rules="[(val) => !!val || 'Este campo es requerido']"
                        ref="vendedorRef"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        v-model="nuevoAnuncio.telefono"
                        label="Telefono"
                        outlined
                        dense
                        type="number"
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') ||
                            'Este campo es obligatorio',
                          (val) => val > 0 || 'Ingresa un numero real',
                          (val) =>
                            /^\d{8}$/.test(val) ||
                            'Ingresa un número de 8 dígitos',
                        ]"
                        ref="telefonoRef"
                      />
                    </div>
                  </div>
                </div>
              </center>
              <br />
              <!-- Primera columna parte de computadora -->
              <fieldset style="border: 2px solid #000000">
                <div class="q-gutter-sm">
                  <div style="justify-content: center; align-items: center">
                    Estado:
                    <q-radio
                      v-model="nuevoAnuncio.estado"
                      val="nuevo"
                      label="Nuevo"
                      outlined
                      ref="estadoRef"
                      dense
                      class="q-mx-md"
                    />
                    <q-radio
                      v-model="nuevoAnuncio.estado"
                      val="usado"
                      ref="estadoRef"
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
                        :rules="[(val) => !!val || 'Este campo es requerido']"
                        ref="marcaRef"
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
                      <q-input
                        v-model="nuevoAnuncio.modelo"
                        outlined
                        dense
                        :rules="[(val) => !!val || 'Este campo es requerido']"
                        ref="modeloRef"
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
                      Pantalla:
                    </div>
                    <div class="col-10 col-md-10.5">
                      <q-input
                        v-model="nuevoAnuncio.pantalla"
                        outlined
                        dense
                        ref="pantallaRef"
                        suffix="Pulgadas"
                        type="number"
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') ||
                            'Este campo es obligatorio',
                          (val) => val > 0 || 'Ingresa un numero real',
                        ]"
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
                        ref="sistemaRef"
                        v-model="nuevoAnuncio.sistema"
                        :options="opcionesSistema"
                        :rules="[(val) => !!val || 'Este campo es requerido']"
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
                        ref="romRef"
                        suffix="GB"
                        type="number"
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') ||
                            'Este campo es obligatorio',
                          (val) => val > 0 || 'Ingresa un numero real',
                        ]"
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
                        ref="ramRef"
                        suffix="GB"
                        type="number"
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') ||
                            'Este campo es obligatorio',
                          (val) => val > 0 || 'Ingresa un numero real',
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset style="border: 2px solid #000000" class="gt-sm">
                <legend>Imagenes</legend>
                <div class="row">
                  <div class="col-2">
                    <q-file
                      v-model="fotos"
                      filled
                      multiple
                      style="width: 40px; height: 50px; overflow: hidden"
                      accept=".jpg, image/*"
                      @update:model-value="obtenerURL"
                    >
                      <q-icon
                        color="green"
                        name="add_circle"
                        style="font-size: 40px; margin: 5px -10px"
                      >
                      </q-icon>
                    </q-file>
                    <br />
                    <br />
                    <q-btn
                      round
                      color="green"
                      icon="remove"
                      @click.stop.prevent="eliminarFotos()"
                    />
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
                        v-for="(img, id) in fotosURL"
                        :key="id"
                        :name="id + 1"
                        :img-src="img"
                      />
                    </q-carousel>
                  </div>
                </div>
              </fieldset>
            </div>

            <div class="col-md-6 col-12 gt-sm">
              <!-- Segunda columna modo computadora-->
              <br /><br /><br /><br />
              <fieldset>
                <div class="q-gutter-sm">
                  <div>
                    Titulo Breve del Anuncio
                    <p></p>
                    <q-input
                      v-model="nuevoAnuncio.titulo"
                      outlined
                      dense
                      ref="tituloRef"
                      :rules="[(val) => !!val || 'Este campo es requerido']"
                    />
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
                      <q-input
                        v-model="nuevoAnuncio.vendedor"
                        outlined
                        dense
                        ref="vendedorRef"
                        :rules="[(val) => !!val || 'Este campo es requerido']"
                      />
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
                      <q-input
                        v-model="nuevoAnuncio.telefono"
                        outlined
                        dense
                        ref="telefonoRef"
                        type="number"
                        :rules="[
                          (val) =>
                            (val !== null && val !== '') ||
                            'Este campo es obligatorio',
                          (val) => val > 0 || 'Ingresa un numero real',
                          (val) =>
                            /^\d{8}$/.test(val) ||
                            'Ingresa un número de 8 dígitos',
                        ]"
                      />
                    </div>
                  </div>
                  <div>
                    Descripción
                    <p></p>
                    <q-input
                      v-model="nuevoAnuncio.descripcion"
                      outlined
                      dense
                      ref="descripcionRef"
                      type="textarea"
                      :rules="[
                        (val) => !!val || 'Este campo es requerido',
                        (val) =>
                          val.length <= 100 ||
                          'Ingrese solamente 100 caracteres',
                      ]"
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
                      ref="precioRef"
                      style="width: 100%"
                      type="number"
                      :rules="[
                        (val) =>
                          (val !== null && val !== '') ||
                          'Este campo es obligatorio',
                        (val) => val > 0 || 'Ingresa un numero real',
                      ]"
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
                  @click="limpiarCampos"
                />
                <q-btn
                  label="Crear"
                  :disable="!validarFormulario"
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
            <div class="col-md-6 col-12 lt-md">
              <fieldset style="border: 2px solid #000000">
                <q-input
                  v-model="nuevoAnuncio.descripcion"
                  label="Descripcion"
                  outlined
                  dense
                  type="textarea"
                  :rules="[
                    (val) => !!val || 'Este campo es requerido',
                    (val) =>
                      val.length <= 100 || 'Ingrese solamente 100 caracteres',
                  ]"
                  ref="descripcionRef"
                />
              </fieldset>
              <q-card-actions align="center" class="text-primary">
                <q-btn
                  label="Cancelar"
                  v-close-popup
                  icon="highlight_off"
                  color="green"
                  @click="limpiarCampos"
                />
                <q-btn
                  :disable="!validarFormulario"
                  label="Crear"
                  icon="save_as"
                  color="green"
                  @click="persistent = true"
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
                  </q-card> </q-dialog
                >>
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
