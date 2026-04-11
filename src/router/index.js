import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Proximamente from '../views/Proximamente.vue'

// Aquí definimos todas las "páginas" (rutas) de nuestra aplicación
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',            // Cuando alguien entre a la raíz ('/')
      name: 'home',         
      component: HomeView   // Mostramos el componente HomeView
    },
    {
      path: '/jugar',
      name: 'jugar',
      component: () => import('../views/JugarView.vue')
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../views/RankingView.vue')
    },
    {
      path: '/acerca-de',
      name: 'acerca-de',
      component: Proximamente
    }
  ]
})

export default router
