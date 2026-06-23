import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("#/views/HomeView.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
