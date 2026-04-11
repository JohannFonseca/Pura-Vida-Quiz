<script setup>
// Aquí importo ref desde vue para poder tener variables reactivas (que se actualizan solas en pantalla)
import { ref } from 'vue';

// Hice un arreglo (array) con todos los juegos para no tener que copiar y pegar HTML a cada rato.
// Así solo uso un v-for más abajo y todo queda más limpio (clean code bro!).
const juegos = ref([
  {
    id: 'sobrevive',
    nombre: 'Sobrevive en Costa Rica',
    descripcion: 'Toma decisiones y sobrevive en la selva tica.',
    imagen: '/imagenes/sobrevive_costa_rica.png', // Las metí aquí para ser ordenado
    ruta: '/proximamente'
  },
  {
    id: 'donde-estoy',
    nombre: '¿Dónde estoy?',
    descripcion: 'Adivina el lugar viendo fotos de Costa Rica.',
    imagen: '/imagenes/donde_estoy.png',
    ruta: '/proximamente'
  },
  {
    id: 'habla-tico',
    nombre: 'Habla como tico',
    descripcion: 'Aprende las frases y dichos populares.',
    imagen: '/imagenes/habla_como_tico.png',
    ruta: '/proximamente'
  },
  {
    id: 'verdadero-falso',
    nombre: 'Verdadero o falso',
    descripcion: 'Mitos y verdades de nuestro país.',
    imagen: '/imagenes/verdadero_falso.png',
    ruta: '/proximamente'
  },
  {
    id: 'planifica-viaje',
    nombre: 'Planifica tu viaje',
    descripcion: 'Organiza el tour perfecto paso a paso.',
    imagen: '/imagenes/planifica_viaje.png',
    ruta: '/proximamente'
  }
]);

</script>

<template>
  <div class="jugar-container">
    <!-- El título de la sección Jugar -->
    <h1 class="title">Modos de <span class="highlight">Juego</span></h1>
    <p class="subtitle">Elige cómo quieres explorar y aprender sobre Costa Rica</p>

    <!-- Esta clase la uso para mostrar todo en modo grid (cuadritos) dependiendo del dispositivo -->
    <div class="grid-juegos">
      <!-- El v-for mágico que me autogenera todas las tarjetas a partir de la variable juegos -->
      <div v-for="juego in juegos" :key="juego.id" class="card-juego" @click="$router.push(juego.ruta)">
        <div class="card-img-container">
          <img :src="juego.imagen" :alt="juego.nombre" class="card-img">
        </div>
        <div class="card-content">
          <h2 class="card-title">{{ juego.nombre }}</h2>
          <p class="card-desc">{{ juego.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jugar-container {
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

/* Grid de Tarjetas */
.grid-juegos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
}

/* En escritorio 3 o 4 (aquí forzamos el grid a 3 columnas en desktop grande para mejorar layout si hay 5 items) */
@media (min-width: 1024px) {
  .grid-juegos {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tarjeta individual */
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
  max-width: 350px;
  border: 1px solid var(--border-color);
  position: relative;
}

.card-juego:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.15); /* Sombra verde sutil */
  border-color: var(--accent-green-light);
}

.card-img-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
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
  flex-grow: 1;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.card-desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .grid-juegos {
    grid-template-columns: repeat(2, 1fr);
  }
  .title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .grid-juegos {
    grid-template-columns: 1fr;
  }
  .card-img-container {
    height: 180px;
  }
}
</style>
