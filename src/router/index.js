import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Proximamente from '../views/Proximamente.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/jugar',
      name: 'jugar',
      component: Proximamente
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: Proximamente
    },
    {
      path: '/acerca-de',
      name: 'acerca-de',
      component: Proximamente
    }
  ]
})

export default router
