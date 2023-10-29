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
          style="width: 100%; height: 600px"
        >
          <q-carousel-slide
            :name="1"
            img-src="https://cdn.quasar.dev/img/mountains.jpg"
          />
          <q-carousel-slide
            :name="2"
            img-src="https://cdn.quasar.dev/img/mountains.jpg"
          />
          <q-carousel-slide
            :name="3"
            img-src="https://cdn.quasar.dev/img/mountains.jpg"
          />
          <q-carousel-slide
            :name="4"
            img-src="https://cdn.quasar.dev/img/mountains.jpg"
          />
        </q-carousel>
      </div>
      <div class="col-12 col-md-6" style="padding-top: 20px">
        <h4 class="text-primary q-mb-sm">Informacion del telefono:</h4>
        <h4 class="text-primary q-mb-sm">Precio:</h4>
        <q-btn
          label="Comprar"
          color="brown"
          icon="shopping_basket"
          class="gt-sm q-mb-md"
        ></q-btn>
        <fieldset style="border: 2px solid #000000; padding: 15px">
          <div class="row">
            <div class="col">
              <h6 class="text-weight-bold">Vendedor:</h6>
            </div>
            <div class="col">
              <h6 class="text-weight-bold">Teléfono:</h6>
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
            <q-item-section><strong>Estado:</strong></q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="smartphone" />
            </q-item-section>

            <q-item-section><strong>Marca:</strong></q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>

            <q-item-section><strong>Modelo:</strong></q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="fullscreen" />
            </q-item-section>

            <q-item-section><strong>Pantalla:</strong></q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings_suggest" />
            </q-item-section>

            <q-item-section><strong>Sistema:</strong></q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="sd_card" />
            </q-item-section>

            <q-item-section><strong>Rom:</strong></q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="insights" />
            </q-item-section>

            <q-item-section><strong>Ram:</strong></q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-12 col-md-6 q-pa-md" style="border: 2px solid #000000">
        <p>
          <center><strong>Detalles</strong></center>
        </p>
        <p>Descripcion del telefono aqui</p>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const navegarInicio = () => {
      // Utiliza el método push de Vue Router para navegar a la página deseada
      router.push("/");
    };

    return {
      slide: ref(1),
      navegarInicio,
    };
  },
};
</script>
