<template>
  <div class="row contenedores">
    {{ anuncios }}
    <!--tarjeta 1-->
    <div class="col-6 col-md-3" v-for="(dato, i) in anuncios" :key="i">
      <q-card class="my-card-small q-mx-xs" flat bordered>
        <q-img :src="dato.imagen" />

        <q-card-section>
          <div class="text-overline text-green-9">
            <center>{{ dato.marcaTelefono }}</center>
          </div>

          <div class="text-h6 q-mt-xs q-mb-xs">
            <center>$ {{ dato.precio }}</center>
          </div>

          <div class="text-caption text-grey">
            <center>{{ dato.descripcion }}</center>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn
            flat
            color="primary"
            label="Ver"
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
      router.push("/informacion");
    };

    return {
      navigateToDetailsPage,
    };
  },
};
</script>

<style lang="scss" scoped></style>
