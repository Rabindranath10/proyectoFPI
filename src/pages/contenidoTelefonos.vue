<template>
  <div style="background-color: #f5f5f5">
    <div class="row q-pa-md">
      <div class="col-12 col-md-6" style="padding: 10px">
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
          style="width: 90%; height: 500px"
          class="q-mx-md"
        >
          <q-carousel-slide
            v-for="(imagenes, index) in dataTel.imagenesURL"
            :key="index"
            :name="index"
            :img-src="imagenes"
          />
        </q-carousel>
      </div>
      <div class="col-12 col-md-6" style="padding-top: 20px">
        <h4 class="text-primary q-mb-sm">
          Informacion del telefono: {{ dataTel.titulo }}
        </h4>
        <h4 class="text-primary q-mb-sm">Precio: ${{ dataTel.precio }}</h4>
        <q-btn
          label="Comprar"
          color="brown"
          icon="shopping_basket"
          class="gt-sm q-mb-md"
        ></q-btn>
        <fieldset style="border: 2px solid #000000; padding: 15px">
          <div class="row">
            <div class="col">
              <h6 class="text-weight-bold">Vendedor: {{ dataTel.vendedor }}</h6>
            </div>
            <div class="col">
              <h6 class="text-weight-bold">Teléfono:{{ dataTel.telefono }}</h6>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
    <div class="row q-mt-md" style="justify-content: center">
      <h5 class="text-primary">DESCRIPCIÓN</h5>
    </div>
    <div class="row q-mt-md">
      <div class="col-12 col-md-6 q-pa-md" style="border: 2px solid #000000">
        <p>
          <center><strong>Especificaciones</strong></center>
        </p>
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="error_outline" />
            </q-item-section>
            <q-item-section
              ><strong>Estado: {{ dataTel.estado }}</strong></q-item-section
            >
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="smartphone" />
            </q-item-section>

            <q-item-section
              ><strong
                >Marca: {{ dataTel.marcaTelefono }}</strong
              ></q-item-section
            >
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>

            <q-item-section
              ><strong>Modelo: {{ dataTel.modelo }}</strong></q-item-section
            >
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="fullscreen" />
            </q-item-section>

            <q-item-section
              ><strong>Pantalla: {{ dataTel.pantalla }}</strong></q-item-section
            >
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings_suggest" />
            </q-item-section>

            <q-item-section
              ><strong>Sistema: {{ dataTel.sistema }}</strong></q-item-section
            >
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="sd_card" />
            </q-item-section>

            <q-item-section
              ><strong>Rom: {{ dataTel.rom }}</strong></q-item-section
            >
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="insights" />
            </q-item-section>

            <q-item-section
              ><strong>Ram: {{ dataTel.ram }}</strong></q-item-section
            >
          </q-item>
        </q-list>
      </div>
      <div class="col-12 col-md-6 q-pa-md" style="border: 2px solid #000000">
        <p>
          <center><strong>Detalles</strong></center>
        </p>
        <p>{{ dataTel.descripcion }}</p>
      </div>
    </div>
    <q-page-sticky position="bottom-below" :offset="[60, 60]" class="lt-md">
      <q-btn
        color="brown"
        icon="home"
        label="Inicio"
        @click="navegarInicio"
        class="q-mr-sm"
      />
      <q-btn
        label="Comprar"
        color="brown"
        icon="shopping_basket"
        class="q-mr-sm"
      ></q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "boot/firebase";
import { LocalStorage } from "quasar";
let datos = {};

export default {
  setup() {
    const router = useRouter();
    const navegarInicio = () => {
      router.push("/");
    };

    onMounted(async () => {
      console.clear();
      const datoString = LocalStorage.getItem("anuncio");
      if (datoString) {
        datos = JSON.parse(datoString);
      }
    });

    return {
      dataTel: datos,
      slide: ref(1),

      navegarInicio,
    };
  },
};
</script>
