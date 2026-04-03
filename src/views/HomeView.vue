<template>
  <div class="hero">
    <h1 class="title">¡Descubre <span class="highlight">Costa Rica!</span></h1>
    <p class="subtitle">Pon a prueba tu conocimiento sobre nuestra cultura, historia y biodiversidad en este divertido juego interactivo.</p>
    
    <!-- router-link es como la etiqueta <a> pero sin recargar la página, nos lleva directo a /jugar -->
    <router-link to="/jugar" style="text-decoration: none;">
      <button class="cta-button">Empezar a Jugar</button>
    </router-link>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  max-width: 850px;
  padding: 4rem 2rem;
  background: #ffffff; /* Fondo blanco para hacer pop al texto */
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05); /* Sombra */
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

/* Efecto tipo subrayado de marcador "verde" en el texto */
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
  background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%);
  color: #ffffff;
  border: none;
  padding: 1.25rem 3.5rem;
  font-size: 1.125rem;
  font-weight: 800;
  border-radius: 9999px; /* Forma */
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
</style>
