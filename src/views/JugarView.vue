<script setup>
/**
 * JugarView.vue
 * 
 * Esta es la página de selección de juegos. 
 * Usamos un arreglo de objetos para que sea "Data-Driven" (basado en datos),
 * lo cual es una excelente práctica de Clean Code.
 */
// Importamos useRouter para manejar la navegación desde el código si fuera necesario.
import { useRouter } from 'vue-router';

const router = useRouter();

// Lista de juegos disponibles. 
// TIP: Si quiero añadir un juego nuevo, solo lo meto aquí y la interfaz se actualiza sola.
const juegos = ref([
  {
    id: 'sobrevive',
    nombre: 'Sobrevive en Costa Rica',
    descripcion: 'Toma decisiones y sobrevive en la selva tica.',
    imagen: '/imagenes/sobrevive_costa_rica.png',
    ruta: '/quizzes/sobrevive'
  },
  {
    id: 'donde-estoy',
    nombre: '¿Dónde estoy?',
    descripcion: 'Adivina el lugar viendo fotos de Costa Rica.',
    imagen: '/imagenes/donde_estoy.png',
    ruta: '/quizzes/donde-estoy'
  },
  {
    id: 'habla-tico',
    nombre: 'Habla como tico',
    descripcion: 'Demuestra si entiendes la verdadera calle de Costa Rica.',
    imagen: '/imagenes/habla_como_tico.png',
    ruta: '/quizzes/habla-tico'
  },
  {
    id: 'verdadero-falso',
    nombre: 'Verdadero o falso',
    descripcion: 'Mitos y verdades de nuestro país.',
    imagen: '/imagenes/verdadero_falso.png',
    ruta: '/quizzes/verdadero-falso'
  }
]);

// Función de navegación: La mantenemos por si ocupamos lógica extra antes de ir al juego.
const navigateToGame = (ruta) => {
  router.push(ruta);
};

</script>

<template>
  <div class="jugar-container">
    <h1 class="title">Quizzes <span class="highlight">Ticos</span></h1>
    <p class="subtitle">Poné a prueba tu conocimiento sobre nuestra cultura y tradiciones</p>

    <div class="grid-juegos">
      <!-- Usamos router-link para las tarjetas: 
           1. Es mejor para SEO y accesibilidad.
           2. Funciona incluso si hay errores leves en otros scripts.
           3. Muestra la URL al pasar el mouse. -->
      <router-link
        v-for="juego in juegos"
        :key="juego.id"
        :to="juego.ruta"
        class="card-juego"
        style="text-decoration: none;"
      >
        <div class="card-img-container">
          <img v-if="juego.imagen" :src="juego.imagen" :alt="juego.nombre" class="card-img">
          <div v-else class="card-img-placeholder">
            <span class="placeholder-icon">🎮</span>
          </div>
        </div>
        <div class="card-content">
          <h2 class="card-title">{{ juego.nombre }}</h2>
          <p class="card-desc">{{ juego.descripcion }}</p>
        </div>
      </router-link>
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

/* GRID: Organiza las tarjetas de forma automática */
.grid-juegos {
  display: grid;
  /* 'auto-fit' hace que el grid se ajuste al ancho disponible */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
}

@media (min-width: 1024px) {
  .grid-juegos {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* TARJETA INDIVIDUAL */
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
}

/* Efecto visual al pasar el mouse por encima */
.card-juego:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.15);
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
  transform: scale(1.05); /* Efecto de zoom suave */
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

/* PLACEHOLDER cuando no hay imagen */
.card-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 60%, #166534 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-icon {
  font-size: 4rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

/* AJUSTES RESPONSIVOS */
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
