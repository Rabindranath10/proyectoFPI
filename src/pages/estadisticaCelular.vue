<template>
  <q-page class="fondo">
    <q-page-container class="q-gutter-md">
      <div class="q-pa-md">
        <div class="q-gutter-md">
          <div class="row">
            <!-- celda 1 -->
            <div class="col-xs-12 col-md-6">
              <div class="q-pa-md border text-center">
                <!-- Contenido de celda 1 -->
                <div class="text-h6">
                  <div class="q-pa-md">
                    <q-img
                      src="https://png.pngtree.com/thumb_back/fw800/background/20230617/pngtree-gold-colored-smart-phone-mockup-design-in-luxurious-3d-rendering-on-image_3641700.jpg"
                      spinner-color="white"
                      style="height: 170px; max-width: 300px"
                      img-class="my-custom-image"
                      class="rounded-borders"
                    >
                      <div class="absolute-bottom text-subtitle1">
                        <div v-if="todos.length > 0">
                          <p>Total de Dispositivos: {{ todos.length }}</p>
                        </div>
                        <div v-else>Cargando...</div>
                      </div>
                    </q-img>
                    <br /><br />
                  </div>
                </div>
              </div>
            </div>
            <!-- celda 2 -->
            <div class="col-xs-12 col-md-6">
              <div class="q-pa-md border text-center">
                <!-- Contenido de celda 2 -->
                <q-card class="text-center">
                  <div class="text-h6">Dispositivos Registrados</div>
                  <q-card-section class="text-center">
                    <div class="row mt-3">
                      <div class="col-md-6 offset-md-3">
                        <div class="card border border-dark">
                          <q-card
                            style="
                              border: 1px solid black;
                              border-top: 14px solid black;
                            "
                          >
                            <canvas ref="barChart"></canvas>
                          </q-card>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <!-- celda 3 -->
            <div class="col-xs-12 col-md-6">
              <div class="q-pa-md border text-center">
                <!-- Contenido de celda 3 -->
                <q-card class="text-center">
                  <div class="text-h6">Dispositivos Registrados</div>
                  <q-card-section class="text-center">
                    <div class="row mt-3">
                      <div class="col-md-6 offset-md-3">
                        <div class="card border border-dark">
                          <q-card
                            style="
                              border: 1px solid black;
                              border-top: 14px solid black;
                            "
                          >
                            <canvas ref="pieChart"></canvas>
                          </q-card>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <!-- celda 4 -->
            <div class="col-xs-12 col-md-6">
              <div class="q-pa-md border text-center">
                <!-- Contenido de celda 4 -->
                <q-card class="text-center">
                  <div class="text-h6">Dispositivos Registrados</div>
                  <q-card-section class="text-center">
                    <div class="row mt-3">
                      <div class="col-md-6 offset-md-3">
                        <div class="card border border-dark">
                          <q-card
                            style="
                              border: 1px solid black;
                              border-top: 14px solid black;
                            "
                          >
                            <canvas ref="lineChart"></canvas>
                          </q-card>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { db } from "boot/firebase";
import { useCollection } from "vuefire";
import { collection, query, where } from "firebase/firestore";
import Chart from "chart.js/auto";

const barChart = ref(null);
const pieChart = ref(null);
const lineChart = ref(null);
const todos = useCollection(collection(db, "anuncios"));

const queryWindows = query(
  collection(db, "anuncios"),
  where("sistema", "==", "Windows")
);
const datoswindows = useCollection(queryWindows);

const queryAndroid = query(
  collection(db, "anuncios"),
  where("sistema", "==", "Android")
);
const datosandroid = useCollection(queryAndroid);

const queryIOS = query(
  collection(db, "anuncios"),
  where("sistema", "==", "Ios")
);
const datosIOS = useCollection(queryIOS);

const windowsData = ref(0);
const androidData = ref(0);
const iosData = ref(0);

const createBarChart = () => {
  const data = {
    labels: ["Windows", "Android", "IOS"],
    datasets: [
      {
        label: "Dispositivos",
        data: [windowsData.value, androidData.value, iosData.value],
        backgroundColor: [
          "rgb(250, 240, 230)",
          "rgb(112, 128, 144)",
          "rgb(169, 169, 169)",
        ],
        borderColor: "dark",
        borderWidth: 4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chart = new Chart(barChart.value, {
    type: "bar",
    data: data,
    options: options,
  });
};

const createPieChart = () => {
  const data = {
    labels: ["Windows", "Android", "IOS"],
    datasets: [
      {
        label: "Dispositivos",
        data: [windowsData.value, androidData.value, iosData.value],
        backgroundColor: [
          "rgb(250, 240, 230)",
          "rgb(112, 128, 144)",
          "rgb(169, 169, 169)",
        ],
        borderColor: "dark",
        borderWidth: 4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chart = new Chart(pieChart.value, {
    type: "pie",
    data: data,
    options: options,
  });
};

const createLineChart = () => {
  const data = {
    labels: ["Windows", "Android", "IOS"],
    datasets: [
      {
        label: "Dispositivos",
        data: [windowsData.value, androidData.value, iosData.value],
        fill: false,
        borderColor: "rgb(128, 0, 0)",
        borderWidth: 4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const chart = new Chart(lineChart.value, {
    type: "line",
    data: data,
    options: options,
  });
};

onMounted(() => {
  const createCharts = () => {
    createBarChart();
    createPieChart();
    createLineChart();
  };

  watch([datoswindows, datosandroid, datosIOS], () => {
    if (
      datoswindows.value &&
      datosandroid.value &&
      datosIOS.value &&
      datoswindows.value.length > 0 &&
      datosandroid.value.length > 0 &&
      datosIOS.value.length > 0 &&
      todos.value.length > 0
    ) {
      windowsData.value = datoswindows.value.length;
      androidData.value = datosandroid.value.length;
      iosData.value = datosIOS.value.length;
      createCharts();
    }
  });
});
</script>

<style>
/* Estilos opcionales para bordes y espaciado */
.border {
  border: 1px solid #ccc;
}
</style>
