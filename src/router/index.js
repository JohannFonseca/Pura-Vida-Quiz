import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AcercaDeView from '../views/AcercaDeView.vue'
import Proximamente from '../views/Proximamente.vue'

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
      // Esto es "Lazy Loading": el código de JugarView solo se descarga cuando el usuario entra ahí.
      // ¡Es genial para que la app inicial cargue más rápido!
      component: () => import('../views/JugarView.vue')
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
      path: '/proximamente',
      name: 'proximamente',
      component: Proximamente
    }
  ]
})

export default router
