<template>
  <div class="hero">
    <h1 class="title">¡Descubre <span class="highlight">Costa Rica!</span></h1>
    <p class="subtitle">Pon a prueba tu conocimiento sobre nuestra cultura, historia y biodiversidad en este divertido juego interactivo.</p>
    
    <!-- router-link es el componente de VueRouter que nos permite navegar entre páginas
         sin que el navegador tenga que recargar todo (SPA - Single Page Application) -->
    <router-link to="/quizzes" style="text-decoration: none;">
      <button class="cta-button">Empezar a Jugar</button>
    </router-link>


  </div>

  <!-- Decoración visual: El efecto del océano en la parte inferior -->
  <div class="waves-container">
    <div class="real-ocean"></div>
  </div>
</template>

<style scoped>
/* 'scoped' significa que estos estilos solo afectan a este componente */

.hero {
  text-align: center;
  max-width: 850px;
  padding: 4rem 2rem;
  background: #ffffff; 
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  /* Centramos el hero en la pantalla */
  margin: 0 auto;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--text-main);
}

.highlight {
  color: var(--accent-green-dark);
  position: relative;
  display: inline-block;
  padding: 0 0.5rem;
}

/* El pseudo-elemento ::after crea una capa visual extra detrás del texto */
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
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.cta-button {
  /* Usamos variables CSS (var--) definidas en main.css para mantener consistencia */
  background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%);
  color: #ffffff;
  border: none;
  padding: 1.25rem 3.5rem;
  font-size: 1.125rem;
  font-weight: 800;
  border-radius: 9999px; 
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(34, 197, 94, 0.4);
}

.cta-button:active {
  transform: translateY(1px);
}



/* Responsivo: Ajustes para pantallas de celular */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }
  
  .hero {
    padding: 3rem 1.5rem;
  }
}

/* EFECTO OCÉANO ANIMADO */
.waves-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 25vh;
  min-height: 150px;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.real-ocean {
  width: 200%;
  height: 100%;
  background-image: url('/imagenes/real-ocean.jpg');
  background-size: cover;
  background-position: center bottom;
  background-repeat: repeat-x;
  
  /* Esto hace que el borde superior de la imagen se vea difuminado */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 60%);
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 60%);
  
  animation: pan-ocean 40s linear infinite;
  opacity: 0.9;
}

@keyframes pan-ocean {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
