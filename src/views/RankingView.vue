<script setup>
// importamos lo necesario de Vue
import { ref, onMounted } from 'vue'
// importamos nuestra función de ranking
import { obtenerRanking } from '../services/ranking'

// ref() crea una variable que cuando cambia, vue actualiza la pantalla automáticamente
const topJugadores = ref([]) // Inicia vacío
const cargando = ref(true)   // Inicia como "estoy cargando"

// onMounted se ejecuta apenas la página se abre
onMounted(async () => {
  // Pedimos los datos y los guardamos
  topJugadores.value = await obtenerRanking()
  // Terminamos de cargar
  cargando.value = false
})
</script>

<template>
  <div class="ranking-container">
    <h1 class="title">Top <span class="highlight">Jugadores</span></h1>
    
    <div v-if="cargando" class="loading">
      Cargando ranking...
    </div>
    
    <div v-else-if="topJugadores.length === 0" class="empty">
      Aún no hay puntuaciones. ¡Sé el primero en jugar!
    </div>

    <div v-else class="leaderboard">
      <div v-for="(jugador, index) in topJugadores" :key="jugador.id" class="jugador-row">
        <div class="posicion" :class="{ 'top-3': index < 3 }">#{{ index + 1 }}</div>
        <div class="nombre">{{ jugador.usuario }}</div>
        <div class="puntuacion">{{ jugador.puntuacion }} pts</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranking-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
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
  gap: 1rem;
}

.jugador-row {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: transform 0.2s;
}

.jugador-row:hover {
  transform: translateX(5px);
  background: #f1f5f9;
}

.posicion {
  font-weight: bold;
  font-size: 1.2rem;
  color: #94a3b8;
  width: 50px;
}

.posicion.top-3 {
  color: var(--accent-green);
}

.nombre {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
}

.puntuacion {
  font-weight: 800;
  color: var(--accent-green-dark);
}

.loading, .empty {
  text-align: center;
  color: #64748b;
  padding: 2rem;
}
</style>
