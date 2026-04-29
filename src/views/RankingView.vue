<script setup>
/**
 * RankingView.vue
 * 
 * Esta es la tabla de líderes. Aquí mostramos quiénes son los mejores jugadores
 * consultando los datos desde Supabase (nuestra base de datos en la nube).
 */

import { ref, onMounted } from 'vue'
// Importamos el servicio que se encarga de hablar con la base de datos
import { obtenerRanking } from '../services/ranking'

// -- VARIABLES REACTIVAS --
// 'ref' crea una variable que, al cambiar, avisa a Vue para redibujar la pantalla.
const topJugadores = ref([]) // Lista de los mejores 10
const cargando = ref(true)   // Estado para mostrar un mensaje de "espere"

/**
 * lifecycle hook: onMounted
 * Se ejecuta automáticamente cuando el componente ya está en pantalla.
 * Es el lugar ideal para cargar datos de una API o Base de Datos.
 */
onMounted(async () => {
  try {
    // Llamamos a la función asíncrona (async) y esperamos (await) el resultado
    topJugadores.value = await obtenerRanking()
  } catch (error) {
    console.error('Error cargando el ranking:', error)
  } finally {
    // Pase lo que pase, dejamos de mostrar el estado de carga
    cargando.value = false
  }
})

/**
 * Formatea la fecha de Supabase a algo legible
 */
const formatearFecha = (fechaIso) => {
  if (!fechaIso) return ''
  const date = new Date(fechaIso)
  return date.toLocaleString('es-CR', { 
    day: '2-digit', 
    month: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<template>
  <div class="ranking-container">
    <h1 class="title">Top <span class="highlight">Jugadores</span></h1>
    
    <!-- Renderizado condicional: Mostramos esto SOLO si 'cargando' es true -->
    <div v-if="cargando" class="loading">
      <div class="spinner"></div>
      <p>Consultando a los expertos...</p>
    </div>
    
    <!-- Si no está cargando y la lista está vacía -->
    <div v-else-if="topJugadores.length === 0" class="empty">
      <p>Aún no hay puntuaciones registradas.</p>
      <router-link to="/quizzes">¡Sé el primero en jugar!</router-link>
    </div>

    <!-- Si ya tenemos los datos, los mostramos en una lista -->
    <div v-else class="leaderboard">
      <div v-for="(jugador, index) in topJugadores" :key="jugador.id" class="jugador-row">
        <!-- 'index' nos da la posición (0, 1, 2...). Le sumamos 1 para el ranking real. -->
        <div class="posicion" :class="{ 'top-3': index < 3 }">
          {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '#' + (index + 1) }}
        </div>
        <div class="info-jugador">
          <div class="nombre">{{ jugador.usuario }}</div>
          <div class="detalles-extra">
            <span v-if="jugador.sala" class="sala-tag">📍 {{ jugador.sala }}</span>
            <span class="fecha-tag">🕒 {{ formatearFecha(jugador.created_at) }}</span>
          </div>
        </div>
        <div class="puntuacion">{{ jugador.puntuacion }} pts</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
}

.title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-main);
  font-weight: 800;
}

.highlight {
  color: var(--accent-green-dark);
  position: relative;
  display: inline-block;
  padding: 0 0.5rem;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 100%;
  height: 30%;
  background-color: var(--accent-green-light);
  z-index: -1;
  opacity: 0.5;
  border-radius: 4px;
}

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.jugador-row {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.jugador-row:hover {
  transform: scale(1.02);
  background: #ffffff;
  border-color: var(--accent-green-light);
  box-shadow: 0 10px 20px rgba(0,0,0,0.03);
}

.posicion {
  font-weight: 800;
  font-size: 1.2rem;
  color: #94a3b8;
  width: 60px;
  text-align: center;
}

.posicion.top-3 {
  color: var(--accent-green-dark);
  font-size: 1.4rem;
}

.nombre {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.info-jugador {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.detalles-extra {
  display: flex;
  gap: 0.8rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.sala-tag {
  color: #0ea5e9;
  font-weight: 600;
}

.puntuacion {
  font-weight: 800;
  color: var(--accent-green-dark);
  background: var(--accent-green-light);
  padding: 0.4rem 0.8rem;
  border-radius: 99px;
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Efectos de carga */
.loading, .empty {
  text-align: center;
  color: #64748b;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(34, 197, 94, 0.1);
  border-top-color: var(--accent-green);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
