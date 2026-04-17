<script setup>
/**
 * AcercaDeView.vue
 * 
 * Esta página explica de qué trata el proyecto.
 * Es una buena oportunidad para usar componentes de VueRouter y funciones de navegación.
 */

import { useRouter } from 'vue-router';

// Usamos useRouter() para obtener acceso al objeto de navegación de la app
const router = useRouter();

/**
 * Función para navegar a la pantalla de juegos.
 */
const goPlay = () => {
  router.push('/jugar');
};

/**
 * Función para abrir WhatsApp con un mensaje predefinido.
 * Esto es muy útil en portafolios personales.
 */
const openWhatsApp = () => {
  const number = "50685803868";
  const message = "Hola, vi Pura Vida Quiz y me interesa saber más";
  // encodeURIComponent asegura que el texto sea válido para una URL
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  // '_blank' abre el link en una nueva pestaña
  window.open(url, '_blank', 'noopener,noreferrer');
};
</script>

<template>
  <div class="acerca-container">
    
    <!-- SECCIÓN: HERO (Introducción) -->
    <div class="hero-card">
      <h1 class="title">Descubrí Costa Rica <span class="highlight">Jugando</span> 🇨🇷</h1>
      <p class="subtitle">
        Un quiz interactivo diseñado para aprender, competir y divertirse con la cultura costarricense.
      </p>
      <button class="cta-button" @click="goPlay">Empezar a jugar</button>
    </div>

    <!-- SECCIÓN: INFORMACIÓN GENERAL -->
    <div class="info-card mt-4">
      <div class="info-text">
        <h2 class="section-title">¿Qué es Pura Vida Quiz?</h2>
        <p class="text-body">
          Pura Vida Quiz es una plataforma interactiva que combina entretenimiento y aprendizaje para explorar Costa Rica de una forma diferente.<br><br>
          A través de juegos dinámicos, podés descubrir lugares, cultura, expresiones y datos curiosos del país.
        </p>
      </div>
      <div class="info-img-box">
        <img src="/imagenes/planifica_viaje.png" alt="Ilustración Pura Vida" class="info-img" />
      </div>
    </div>

    <!-- SECCIÓN: PÚBLICO META -->
    <div class="content-section">
      <h2 class="section-title text-center">¿Para quién es?</h2>
      <div class="audience-grid">
        <div class="mini-card">
          <div class="emoji-icon">🗺️</div>
          <h3>Turistas</h3>
          <p>Que quieren conocer más sobre el país.</p>
        </div>
        <div class="mini-card">
          <div class="emoji-icon">✈️</div>
          <h3>Viajeros</h3>
          <p>Amantes de la aventura y el descubrimiento.</p>
        </div>
        <div class="mini-card">
          <div class="emoji-icon">📚</div>
          <h3>Estudiantes</h3>
          <p>Buscando aprender datos curiosos e historia.</p>
        </div>
        <div class="mini-card">
          <div class="emoji-icon">🦥</div>
          <h3>Ticos</h3>
          <p>Que quieren poner a prueba su "ticociclo".</p>
        </div>
      </div>
    </div>

    <!-- SECCIÓN: RESUMEN DE JUEGOS -->
    <div class="content-section">
      <h2 class="section-title text-center">Modos de Juego</h2>
      <div class="games-grid">
        <div class="game-card shadow">
          <div class="card-img" style="background-image: url('/imagenes/sobrevive_costa_rica.png');"></div>
          <div class="card-content">
            <h3>Sobrevive en CR</h3>
            <p>Tomá decisiones clave en la selva tica.</p>
          </div>
        </div>
        <div class="game-card shadow">
          <div class="card-img" style="background-image: url('/imagenes/donde_estoy.png');"></div>
          <div class="card-content">
            <h3>¿Dónde estoy?</h3>
            <p>Adiviná lugares icónicos contra reloj.</p>
          </div>
        </div>
        <div class="game-card shadow">
          <div class="card-img" style="background-image: url('/imagenes/habla_como_tico.png');"></div>
          <div class="card-content">
            <h3>Habla como tico</h3>
            <p>¿Entendés nuestras frases más raras?</p>
          </div>
        </div>
        <div class="game-card shadow">
          <div class="card-img" style="background-image: url('/imagenes/verdadero_falso.png');"></div>
          <div class="card-content">
            <h3>Cierto o Falso</h3>
            <p>Desmentí mitos sobre nuestra cultura.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN: CARACTERÍSTICAS -->
    <div class="feature-card">
      <h2 class="section-title text-center">¿Por qué es diferente?</h2>
      <div class="feature-list">
        <div class="feature-item">
          <span class="check">✅</span> <p><strong>Aprendizaje interactivo</strong></p>
        </div>
        <div class="feature-item">
          <span class="check">✅</span> <p><strong>Diseño moderno y dinámico</strong></p>
        </div>
        <div class="feature-item">
          <span class="check">✅</span> <p><strong>Experiencia rápida y divertida</strong></p>
        </div>
        <div class="feature-item">
          <span class="check">✅</span> <p><strong>Contenido cultural 100% real</strong></p>
        </div>
      </div>
    </div>

    <!-- SECCIÓN: CONTACTO (WhatsApp) -->
    <div class="whatsapp-card mt-4">
      <h2 class="whatsapp-title">Pura Vida Quiz conectando culturas.</h2>
      <p class="whatsapp-subtitle">
        Si tenés ideas, querés colaborar o simplemente te gustó el proyecto:
      </p>
      
      <div class="whatsapp-action mt-4">
        <h3>Hablemos 💬</h3>
        <p>Estoy abierto a propuestas, mejoras o cualquier oportunidad para llevar este proyecto al siguiente nivel.</p>
        
        <button class="whatsapp-btn" @click="openWhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          Escribime por WhatsApp
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.acerca-container {
  width: 100%;
  max-width: 850px; 
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 3rem;
  margin: 0 auto;
  /* Animación suave al cargar la página */
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-card {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05); 
}

.title {
  font-size: 3rem;
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
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 1.5rem;
}

.text-center { text-align: center; }
.mt-4 { margin-top: 2rem; }

.cta-button {
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

/* DISEÑO DE TARJETA DIVIDIDA (Texto + Imagen) */
.info-card {
  display: flex;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.03);
}

.info-text {
  flex: 1;
  padding: 2.5rem;
}

.text-body {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-muted);
}

.info-img-box {
  flex: 1;
  background: var(--bg-color);
  min-height: 250px;
}

.info-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-section {
  padding: 1rem 0;
}

/* GRID DE PÚBLICO META */
.audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.mini-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.emoji-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.mini-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.mini-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* GRID DE JUEGOS */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.game-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.08); 
}

.card-img {
  height: 160px;
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid var(--border-color);
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.card-content p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* SECCIÓN DE CARACTERÍSTICAS */
.feature-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 1.5rem auto 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-color);
  padding: 1rem 1.5rem;
  border-radius: 12px;
}

.feature-item p { margin: 0; color: var(--text-main); font-size: 1.05rem; }

/* CONTACTO POR WHATSAPP */
.whatsapp-card {
  background: white;
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  border: 2px solid var(--accent-green-light);
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.1);
  position: relative;
  overflow: hidden;
}

.whatsapp-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; width: 100%; height: 10px;
  background: linear-gradient(90deg, var(--accent-green), var(--accent-green-dark));
}

.whatsapp-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.whatsapp-subtitle {
  font-size: 1.15rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.whatsapp-action {
  background: var(--bg-color);
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 500px;
  margin: 0 auto;
}

.whatsapp-action h3 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text-main);
}

.whatsapp-action p {
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.whatsapp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #25D366;
  color: white;
  font-size: 1.15rem;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.whatsapp-btn:hover {
  transform: translateY(-2px);
  background-color: #20BA56;
  box-shadow: 0 10px 20px rgba(37, 211, 102, 0.2);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero-card, .info-card, .whatsapp-card, .feature-card {
    padding: 2rem 1.5rem;
  }
  .info-card {
    flex-direction: column;
  }
  .title {
    font-size: 2.2rem;
  }
  .section-title, .whatsapp-title {
    font-size: 1.7rem;
  }
}
</style>
