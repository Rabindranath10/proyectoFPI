<template>
  <div class="row contenedores">
    <p class="lt-md gt-sm">{{ anuncios }}</p>

    <!--tarjeta 1-->
    <div class="col-6 col-md-3" v-for="(dato, i) in anuncios" :key="i">
      <q-card class="my-card-small q-ma-xs" flat bordered style="height: 520px">
        <!--Para que se muestre solo la primera imagen del anuncio -->
        <q-img :src="dato.imagenesURL[0]" style="height: 240px" />

        <q-card-section>
          <div class="text-overline text-green-9">
            <center>{{ dato.marcaTelefono }}</center>
          </div>

          <div class="text-h6 q-mt-xs q-mb-xs">
            <center>$ {{ dato.precio }}</center>
          </div>
          <q-avatar
            v-for="size in ['md', 'md', 'md', 'md', 'md']"
            :key="size"
            :size="size"
            color="white"
            text-color="blue"
            icon="star"
          />
          (5.0)
          <p></p>
          <div class="text-caption text-grey" style="height: 50px">
            <center>{{ dato.descripcion }}</center>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn
            flat
            color="primary"
            label="Ver detalles"
            @click="navigateToDetailsPage(dato)"
          />

          <q-space />
        </q-card-actions>

        <q-slide-transition>
          <div v-show="dato.expanded">
            <q-separator />
            <q-card-section class="text-subtitle2">
              {{ dato.lorem }}
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: ["anuncios"],
  setup() {
    const router = useRouter();

    // Función para navegar a la página de detalles
    const navigateToDetailsPage = (data) => {
      // Guarda el anuncio seleccionado en el localStorage
      localStorage.setItem("anuncio", JSON.stringify(data));
      // Utiliza el método push de Vue Router para navegar a la página deseada
      router.push(`/informacion/${data.id}`);
    };

    return {
      navigateToDetailsPage,
    };
  },
};
</script>

<style lang="scss" scoped></style>
