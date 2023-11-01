<template>
  <div class="row contenedores">
    {{ anuncios }}
    <!--tarjeta 1-->
    <div class="col-6 col-md-3" v-for="(dato, i) in datos" :key="i">
      <q-card class="my-card-small q-mx-xs" flat bordered>
        <q-img :src="dato.imagen" />

        <q-card-section>
          <div class="text-overline text-green-9">
            {{ dato.marcaTelefono }}
          </div>

          <div class="text-h6 q-mt-xs q-mb-xs">{{ dato.precio }}</div>

          <div class="text-caption text-grey">{{ dato.descripcion }}</div>
        </q-card-section>

        <q-card-actions>
          <q-btn
            flat
            color="primary"
            label="Ver"
            @click="navigateToDetailsPage"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "boot/firebase";

const datos = ref([
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
  {
    titulo: "Samsung Galaxy A23 ",
    descripcion: "Pantalla de 5.5, 64 GB, 2 GB de Ram, Color negro",
    precio: "$132",
    imagen: "https://game4u.co.za/wp-content/uploads/2022/04/a23.jpg",
  },
]);

export default {
  data() {
    return {
      datos: datos,
    };
  },
  props: ["anuncios"],
  setup() {
    const router = useRouter();

    // Función para navegar a la página de detalles
    const navigateToDetailsPage = () => {
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
