<script setup>
/**
 * JugarView.vue
 * 
 * Página de selección de quizzes con diseño premium.
 * Patrón "Data-Driven": agregar un quiz nuevo = solo un objeto en el arreglo.
 */

// 'ref' para variables reactivas, 'computed' para valores derivados.
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// ID del juego sobre el que está el mouse (para el efecto de highlight)
const hoveredId = ref(null);

// Lista de quizzes con metadatos enriquecidos para el diseño premium.
// TIP: Para añadir un quiz, solo agregá un objeto aquí con los mismos campos.
const juegos = ref([
  {
    id: 'sobrevive',
    nombre: 'Sobrevive en CR',
    descripcion: 'Toma decisiones críticas en la selva tica. ¿Tenés los reflejos para salir vivo?',
    imagen: '/imagenes/sobrevive_costa_rica.png',
    ruta: '/quizzes/sobrevive',
    tag: 'Aventura',
    tagColor: '#22c55e',
    dificultad: 'Difícil',
    preguntas: 8,
    emoji: '🌴',
    accentColor: '#16a34a',
  },
  {
    id: 'donde-estoy',
    nombre: '¿Dónde estoy?',
    descripcion: 'Adivina el rincón de Costa Rica con pistas visuales. ¡Cada foto es un reto!',
    imagen: '/imagenes/donde_estoy.png',
    ruta: '/quizzes/donde-estoy',
    tag: 'Geografía',
    tagColor: '#0ea5e9',
    dificultad: 'Medio',
    preguntas: 10,
    emoji: '📍',
    accentColor: '#0284c7',
  },
  {
    id: 'habla-tico',
    nombre: 'Habla como Tico',
    descripcion: '¿Entendés el tuanis de la calle? Pon a prueba tu dominio del español costarricense.',
    imagen: '/imagenes/habla_como_tico.png',
    ruta: '/quizzes/habla-tico',
    tag: 'Cultura',
    tagColor: '#f59e0b',
    dificultad: 'Fácil',
    preguntas: 12,
    emoji: '🗣️',
    accentColor: '#d97706',
  },
  {
    id: 'verdadero-falso',
    nombre: 'Verdadero o Falso',
    descripcion: 'Mitos y verdades de nuestro país. ¿Sabés distinguir la realidad de la ficción?',
    imagen: '/imagenes/verdadero_falso.png',
    ruta: '/quizzes/verdadero-falso',
    tag: 'Trivia',
    tagColor: '#a855f7',
    dificultad: 'Medio',
    preguntas: 15,
    emoji: '⚡',
    accentColor: '#9333ea',
  }
]);

// Estadísticas calculadas para el hero section
const totalPreguntas = computed(() => juegos.value.reduce((acc, j) => acc + j.preguntas, 0));
</script>

<template>
  <div class="quizzes-page">

    <!-- ═══════════════════════════════════════════
         HERO SECTION — Cabecera animada con partículas
         ═══════════════════════════════════════════ -->
    <section class="hero">
      <!-- Fondo con gradiente animado -->
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="hero-orb orb-3"></div>
      </div>

      <!-- Partículas decorativas (hojas flotando) -->
      <div class="particles" aria-hidden="true">
        <span v-for="i in 12" :key="i" class="particle" :class="`p${i}`">🍃</span>
      </div>

      <div class="hero-content">
        <!-- Etiqueta superior -->
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Costa Rica · Quiz Interactivo
        </div>

        <h1 class="hero-title">
          Ponete a <em>prueba</em><br>
          <span class="title-gradient">como buen tico</span>
        </h1>

        <p class="hero-subtitle">
          Cuatro modos de juego, una sola misión: demostrar que conocés tu país.
        </p>

        <!-- Stats rápidos -->
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">{{ juegos.length }}</span>
            <span class="stat-label">Quizzes</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ totalPreguntas }}+</span>
            <span class="stat-label">Preguntas</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">100%</span>
            <span class="stat-label">Tico</span>
          </div>
        </div>
      </div>

      <!-- Indicador de scroll -->
      <div class="scroll-hint" aria-hidden="true">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         GRID DE TARJETAS — El corazón de la vista
         ═══════════════════════════════════════════ -->
    <section class="cards-section">
      <div class="cards-grid">

        <!-- Usamos router-link para que la navegación sea nativa y confiable -->
        <router-link
          v-for="(juego, index) in juegos"
          :key="juego.id"
          :to="juego.ruta"
          class="card"
          :class="{ 'card--hovered': hoveredId === juego.id }"
          :style="`--accent: ${juego.accentColor}; --tag-color: ${juego.tagColor}; --delay: ${index * 0.1}s`"
          @mouseenter="hoveredId = juego.id"
          @mouseleave="hoveredId = null"
        >
          <!-- Capa de brillo al hacer hover -->
          <div class="card-glow"></div>

          <!-- Imagen de fondo con overlay -->
          <div class="card-image">
            <img :src="juego.imagen" :alt="juego.nombre" loading="lazy">
            <div class="card-image-overlay"></div>

            <!-- Tag de categoría flotante sobre la imagen -->
            <div class="card-tag">{{ juego.tag }}</div>

            <!-- Emoji grande como decoración -->
            <div class="card-emoji">{{ juego.emoji }}</div>
          </div>

          <!-- Contenido textual de la tarjeta -->
          <div class="card-body">
            <div class="card-meta">
              <!-- Nivel de dificultad con punto de color -->
              <span class="difficulty" :class="`diff--${juego.dificultad.toLowerCase()}`">
                <span class="diff-dot"></span>
                {{ juego.dificultad }}
              </span>
              <!-- Número de preguntas -->
              <span class="question-count">{{ juego.preguntas }} preguntas</span>
            </div>

            <h2 class="card-title">{{ juego.nombre }}</h2>
            <p class="card-desc">{{ juego.descripcion }}</p>

            <!-- Botón CTA de la tarjeta -->
            <div class="card-cta">
              <span class="cta-text">Jugar ahora</span>
              <span class="cta-arrow">→</span>
            </div>
          </div>

          <!-- Barra de color de acento en el bottom -->
          <div class="card-accent-bar"></div>
        </router-link>

      </div>
    </section>

  </div>
</template>

<style scoped>
/* ════════════════════════════════════════
   RESET Y BASE
   ════════════════════════════════════════ */
.quizzes-page {
  min-height: 100vh;
  /* Importamos la fuente Outfit para algo más moderno */
  font-family: 'Nunito', sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}

/* ════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════ */
.hero {
  position: relative;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem 4rem;
  overflow: hidden;
  text-align: center;
}

/* Fondo animado con orbs de colores */
.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0f2027 0%, #0d3b1e 50%, #0f2027 100%);
  z-index: 0;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  animation: orbFloat 8s ease-in-out infinite alternate;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #16a34a, transparent);
  top: -150px; left: -100px;
  animation-duration: 9s;
}
.orb-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, #0284c7, transparent);
  top: -50px; right: -80px;
  animation-duration: 12s;
  animation-delay: -3s;
}
.orb-3 {
  width: 250px; height: 250px;
  background: radial-gradient(circle, #a855f7, transparent);
  bottom: -50px; left: 40%;
  animation-duration: 7s;
  animation-delay: -1s;
}

@keyframes orbFloat {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, 20px) scale(1.1); }
}

/* Partículas de hojas */
.particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.particle {
  position: absolute;
  font-size: 1.2rem;
  opacity: 0;
  animation: particleFall 12s linear infinite;
}
/* Distribuimos las hojas por posiciones y tiempos distintos */
.p1  { left: 5%;  animation-delay: 0s;    animation-duration: 14s; font-size: 1rem; }
.p2  { left: 15%; animation-delay: 2s;    animation-duration: 10s; font-size: 0.8rem; }
.p3  { left: 25%; animation-delay: 5s;    animation-duration: 16s; }
.p4  { left: 35%; animation-delay: 1s;    animation-duration: 11s; font-size: 1.4rem; }
.p5  { left: 45%; animation-delay: 7s;    animation-duration: 13s; }
.p6  { left: 55%; animation-delay: 3s;    animation-duration: 9s;  font-size: 0.9rem; }
.p7  { left: 65%; animation-delay: 6s;    animation-duration: 15s; }
.p8  { left: 75%; animation-delay: 4s;    animation-duration: 12s; font-size: 1.1rem; }
.p9  { left: 85%; animation-delay: 8s;    animation-duration: 10s; }
.p10 { left: 92%; animation-delay: 2.5s;  animation-duration: 14s; font-size: 0.8rem; }
.p11 { left: 10%; animation-delay: 9s;    animation-duration: 11s; }
.p12 { left: 70%; animation-delay: 11s;   animation-duration: 13s; font-size: 1.3rem; }

@keyframes particleFall {
  0%   { transform: translateY(-5vh) rotate(0deg);   opacity: 0; }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.5; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

/* Contenido del hero */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(8px);
}

.badge-dot {
  width: 6px; height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulseDot 2s ease-in-out infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.4); }
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 900;
  line-height: 1.1;
  color: #f8fafc;
  margin: 0 0 1rem;
  letter-spacing: -1px;
}

.hero-title em {
  font-style: normal;
  color: #4ade80;
}

.title-gradient {
  background: linear-gradient(90deg, #22c55e, #0ea5e9, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200%;
  animation: gradientShift 4s ease-in-out infinite alternate;
}
@keyframes gradientShift {
  from { background-position: 0%; }
  to   { background-position: 100%; }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(248, 250, 252, 0.65);
  margin: 0 0 2.5rem;
  line-height: 1.6;
}

/* Stats del hero */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 1.2rem 2.5rem;
  width: fit-content;
  margin: 0 auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.stat-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: #f8fafc;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(248, 250, 252, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

/* Indicador de scroll animado */
.scroll-hint {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.scroll-arrow {
  width: 24px; height: 24px;
  border-right: 2px solid rgba(255,255,255,0.3);
  border-bottom: 2px solid rgba(255,255,255,0.3);
  transform: rotate(45deg);
  animation: scrollBounce 1.5s ease-in-out infinite;
}
@keyframes scrollBounce {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.4; }
  50%       { transform: rotate(45deg) translateY(6px); opacity: 1; }
}

/* ════════════════════════════════════════
   GRID DE TARJETAS
   ════════════════════════════════════════ */
.cards-section {
  padding: 4rem 1.5rem 5rem;
  max-width: 1280px;
  margin: 0 auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.8rem;
}

/* ════════════════════════════════════════
   TARJETA INDIVIDUAL — El corazón del diseño
   ════════════════════════════════════════ */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  /* Animación de entrada escalonada */
  opacity: 0;
  transform: translateY(30px);
  animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay);

  /* Transición de hover suave */
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease,
    border-color 0.3s ease;
}

@keyframes cardIn {
  to { opacity: 1; transform: translateY(0); }
}

.card:hover {
  transform: translateY(-10px) scale(1.01);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 0 2px var(--accent),
    0 0 40px color-mix(in srgb, var(--accent) 20%, transparent);
  border-color: var(--accent);
}

/* Efecto de brillo que sigue el hover */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 0%,
    color-mix(in srgb, var(--accent) 12%, transparent),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}
.card:hover .card-glow { opacity: 1; }

/* ── Imagen ── */
.card-image {
  position: relative;
  height: 210px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  display: block;
}

.card:hover .card-image img {
  transform: scale(1.08);
}

/* Overlay gradiente sobre la imagen */
.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 30%,
    rgba(0, 0, 0, 0.45) 100%
  );
  transition: opacity 0.3s;
}

/* Tag flotante de categoría */
.card-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--tag-color);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2;
}

/* Emoji decorativo sobre la imagen */
.card-emoji {
  position: absolute;
  bottom: 14px;
  right: 16px;
  font-size: 2.4rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;
  line-height: 1;
}
.card:hover .card-emoji {
  transform: scale(1.2) rotate(-8deg);
}

/* ── Cuerpo ── */
.card-body {
  padding: 1.4rem 1.5rem 1.8rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  z-index: 2;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.difficulty {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

/* Color del punto según dificultad */
.diff-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
}
.diff--fácil   .diff-dot { background: #22c55e; }
.diff--medio   .diff-dot { background: #f59e0b; }
.diff--difícil .diff-dot { background: #ef4444; }
.diff--fácil   { color: #16a34a; }
.diff--medio   { color: #d97706; }
.diff--difícil { color: #dc2626; }

.question-count {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 700;
}

.card-title {
  font-size: 1.45rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0 0 0.6rem;
  line-height: 1.2;
  letter-spacing: -0.3px;
  transition: color 0.3s;
}
.card:hover .card-title { color: var(--accent); }

.card-desc {
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 1.4rem;
  flex: 1;
}

/* Botón CTA al pie de la tarjeta */
.card-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  border-radius: 12px;
  padding: 0.75rem 1.2rem;
  transition: all 0.3s ease;
}
.card:hover .card-cta {
  background: var(--accent);
  border-color: var(--accent);
}

.cta-text {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--accent);
  transition: color 0.3s;
}
.card:hover .cta-text { color: #fff; }

.cta-arrow {
  font-size: 1.1rem;
  color: var(--accent);
  transition: transform 0.3s ease, color 0.3s;
}
.card:hover .cta-arrow {
  transform: translateX(5px);
  color: #fff;
}

/* Barra de acento en la parte inferior de la tarjeta */
.card-accent-bar {
  height: 4px;
  background: linear-gradient(90deg, var(--accent), var(--tag-color));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.card:hover .card-accent-bar { transform: scaleX(1); }

/* ════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════ */
@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 640px) {
  .hero { padding: 4rem 1.5rem 3rem; min-height: 360px; }
  .hero-stats { padding: 1rem 1.5rem; gap: 1.2rem; }
  .cards-section { padding: 2.5rem 1rem 4rem; }
  .cards-grid { grid-template-columns: 1fr; gap: 1.2rem; }
  .card-image { height: 180px; }
}
</style>
