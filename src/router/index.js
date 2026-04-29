import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AcercaDeView from '../views/AcercaDeView.vue'
import Proximamente from '../views/Proximamente.vue'
import JugarView from '../views/JugarView.vue'

/**
 * router/index.js
 * 
 * Este es el "Mapa" de nuestra aplicación. Aquí le decimos a Vue qué componente
 * mostrar dependiendo de la dirección (URL) que escribamos en el navegador.
 */

const router = createRouter({
  // 'createWebHistory' hace que las URLs se vean limpias (ej: /jugar en vez de /#/jugar)
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/',            // Cuando la ruta es la raíz (el inicio)
      name: 'home',         
      component: HomeView   // Cargamos el componente HomeView de inmediato
    },
    {
      path: '/jugar',
      name: 'jugar',
      component: JugarView
    },
    {
      path: '/jugar/sobrevive',
      name: 'sobrevive',
      component: () => import('../views/games/SobreviveView.vue')
    },
    {
      path: '/jugar/donde-estoy',
      name: 'donde-estoy',
      component: () => import('../views/games/DondeEstoyView.vue')
    },
    {
      path: '/jugar/habla-tico',
      name: 'habla-tico',
      component: () => import('../views/games/HablaTicoView.vue')
    },
    {
      path: '/jugar/verdadero-falso',
      name: 'verdadero-falso',
      component: () => import('../views/games/VerdaderoFalsoView.vue')
    },
    {
      path: '/jugar/beta',
      name: 'beta',
      component: () => import('../views/games/BetaScreen.vue')
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../views/RankingView.vue')
    },
    {
      path: '/acerca-de',
      name: 'acerca-de',
      component: AcercaDeView
    },
    {
      path: '/planificador',
      name: 'planificador',
      component: () => import('../views/PlanificaTuViajeView.vue')
    },
    {
      path: '/minijuegos',
      name: 'minijuegos',
      component: () => import('../views/MinijuegosView.vue')
    },
    {
      path: '/minijuegos/pelea',
      name: 'pelea',
      component: () => import('../views/games/FightView.vue')
    },
    {
      path: '/proximamente',
      name: 'proximamente',
      component: Proximamente
    }
  ]
})

export default router
