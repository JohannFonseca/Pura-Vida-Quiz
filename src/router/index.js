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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // Redirección: Si por error entro a /jugar (ruta vieja), me manda a /quizzes automáticamente.
    {
      path: '/jugar',
      redirect: '/quizzes'
    },
    // Lo mismo para el Runner, si entro por la ruta de antes, me lleva a la nueva.
    {
      path: '/jugar/beta',
      redirect: '/minijuegos/runner'
    },
    // Esta es la nueva "casa" de los quizzes.
    {
      path: '/quizzes',
      name: 'quizzes',
      component: JugarView
    },
    // Rutas individuales para cada quiz. Usamos 'import' dinámico para cargar solo lo que el usuario ocupa.
    {
      path: '/quizzes/sobrevive',
      name: 'sobrevive',
      component: () => import('../views/games/SobreviveView.vue')
    },
    {
      path: '/quizzes/donde-estoy',
      name: 'donde-estoy',
      component: () => import('../views/games/DondeEstoyView.vue')
    },
    {
      path: '/quizzes/habla-tico',
      name: 'habla-tico',
      component: () => import('../views/games/HablaTicoView.vue')
    },
    {
      path: '/quizzes/verdadero-falso',
      name: 'verdadero-falso',
      component: () => import('../views/games/VerdaderoFalsoView.vue')
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
      path: '/minijuegos/runner',
      name: 'runner',
      component: () => import('../views/games/BetaScreen.vue')
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
