<script setup>
/**
 * MinijuegosView.vue
 * 
 * Sección dedicada a juegos de acción/arcade (Canvas, etc.)
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const minijuegos = ref([
  {
    id: 'runner',
    nombre: '🏃 Pura Vida Runner',
    descripcion: 'Corre por parajes de Costa Rica, esquiva obstáculos y recolecta elementos nacionales.',
    imagen: '/imagenes/minijuego_bg_seamless.png',
    ruta: '/minijuegos/runner'
  },
  {
    id: 'pelea',
    nombre: '🥊 Pelea en el Redondel',
    descripcion: 'Seleccioná tu luchador y combatí en el redondel de toros. ¡Güipipía! ¡Pura macha!',
    imagen: '/imagenes/pelea_redondel.png',
    ruta: '/minijuegos/pelea'
  }
]);

const navigateToGame = (ruta) => {
  router.push(ruta);
};
</script>

<template>
  <div class="minijuegos-container">
    <h1 class="title">Arcade <span class="highlight">Minijuegos</span></h1>
    <p class="subtitle">Diversión rápida y acción al estilo Pura Vida</p>

    <div class="grid-juegos">
      <router-link
        v-for="juego in minijuegos"
        :key="juego.id"
        :to="juego.ruta"
        class="card-juego"
        style="text-decoration: none;"
      >
        <div class="card-img-container">
          <img v-if="juego.imagen" :src="juego.imagen" :alt="juego.nombre" class="card-img">
          <div v-else class="card-img-placeholder">
            <span class="placeholder-icon">{{ juego.id === 'pelea' ? '🥊' : '🕹️' }}</span>
          </div>
        </div>
        <div class="card-content">
          <h2 class="card-title">{{ juego.nombre }}</h2>
          <p class="card-desc">{{ juego.descripcion }}</p>
          <div class="card-tag">Acción</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.minijuegos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.title {
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-main);
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

.subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
}

.grid-juegos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.card-juego {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border-color);
}

.card-juego:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.2);
  border-color: var(--accent-green-light);
}

.card-img-container {
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-juego:hover .card-img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.card-desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.card-tag {
  align-self: flex-start;
  background: var(--accent-green-light);
  color: var(--accent-green-dark);
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-icon {
  font-size: 4rem;
}
</style>
