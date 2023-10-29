const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),

    children: [
      {
        path: "",
        name: "MainLayout.vue",
        component: () => import("pages/contenidoInicio.vue"),
      },
    ],
  },
  {
    path: "/informacion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",

        component: () => import("pages/contenidoTelefonos.vue"),
      },
    ],
  },
  {
    path: "/proceso",
    component: () => import("pages/paginaProceso.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
