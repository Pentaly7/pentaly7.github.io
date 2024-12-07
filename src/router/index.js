import {createRouter, createWebHistory} from 'vue-router'
import FirstPage from "@/views/FirstPage.vue";
import App from "@/App.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App,
      children: [
        {
          path: '',
          name: 'first-page',
          component: FirstPage
        }
      ]
    },
  ],
})

export default router
