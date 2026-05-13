<script setup>
/**
 * MinijuegosView.vue
 * 
 * Sección de juegos de acción/arcade. Mismo patrón Data-Driven que JugarView:
 * agregar un juego nuevo = solo un objeto al arreglo.
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const hoveredId = ref(null);

// Cada minijuego tiene sus propios colores y metadata para el diseño
const minijuegos = ref([
  {
    id: 'runner',
    nombre: 'Pura Vida Runner',
    descripcion: 'Corré por los paisajes más icónicos de Costa Rica, esquivá obstáculos y recolectá la flora y fauna nacional.',
    imagen: '/imagenes/minijuego_bg_seamless.png',
    ruta: '/minijuegos/runner',
    tag: 'Runner',
    tagColor: '#22c55e',
    accentColor: '#16a34a',
    emoji: '🏃',
    modo: 'Infinito',
    controles: 'Teclado / Táctil',
  },
  {
    id: 'pelea',
    nombre: 'Pura Vida Fighters',
    descripcion: 'Elegí tu luchador tico y combatí en el redondel de toros. ¡Cada peleador tiene habilidades únicas!',
    imagen: '/imagenes/pelea_redondel.png',
    ruta: '/minijuegos/pelea',
    tag: 'Pelea',
    tagColor: '#ef4444',
    accentColor: '#dc2626',
    emoji: '🥊',
    modo: 'VS CPU',
    controles: 'Teclado / Táctil',
  },
  {
    id: 'pesca',
    nombre: 'Pesca Tica Pro',
    descripcion: 'Una experiencia cinematográfica de pesca. ¿Podrás capturar al legendario Dorado de Puntarenas?',
    imagen: '/imagenes/pesca_bg.png',
    ruta: '/minijuegos/pesca',
    tag: 'Simulador',
    tagColor: '#0ea5e9',
    accentColor: '#0284c7',
    emoji: '🎣',
    modo: 'Progreso',
    controles: 'Táctil / Click',
  }
]);
</script>

<template>
  <div class="minijuegos-page">

    <!-- ═══════════════════ HERO ═══════════════════ -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
      </div>
      <div class="particles" aria-hidden="true">
        <span v-for="i in 8" :key="i" class="particle" :class="`p${i}`">🎮</span>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Arcade · Acción Pura
        </div>
        <h1 class="hero-title">
          Mini<em>juegos</em><br>
          <span class="title-gradient">Pura Vida Style</span>
        </h1>
        <p class="hero-subtitle">
          Diversión instantánea al estilo costarricense. Sin cargadas largas, solo acción.
        </p>
      </div>

      <div class="scroll-hint" aria-hidden="true">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- ═══════════════════ CARDS ═══════════════════ -->
    <section class="cards-section">
      <div class="cards-grid">
        <router-link
          v-for="(juego, index) in minijuegos"
          :key="juego.id"
          :to="juego.ruta"
          class="card"
          :style="`--accent: ${juego.accentColor}; --tag-color: ${juego.tagColor}; --delay: ${index * 0.12}s`"
          @mouseenter="hoveredId = juego.id"
          @mouseleave="hoveredId = null"
        >
          <div class="card-glow"></div>

          <div class="card-image">
            <img :src="juego.imagen" :alt="juego.nombre" loading="lazy">
            <div class="card-image-overlay"></div>
            <div class="card-tag">{{ juego.tag }}</div>
            <div class="card-emoji">{{ juego.emoji }}</div>
          </div>

          <div class="card-body">
            <div class="card-meta">
              <span class="meta-pill">{{ juego.modo }}</span>
              <span class="meta-controls">{{ juego.controles }}</span>
            </div>

            <h2 class="card-title">{{ juego.nombre }}</h2>
            <p class="card-desc">{{ juego.descripcion }}</p>

            <div class="card-cta">
              <span class="cta-text">¡Jugar!</span>
              <span class="cta-arrow">→</span>
            </div>
          </div>

          <div class="card-accent-bar"></div>
        </router-link>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ════════ BASE ════════ */
.minijuegos-page {
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
}
a { text-decoration: none; color: inherit; }

/* ════════ HERO ════════ */
.hero {
  position: relative;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem 4rem;
  overflow: hidden;
  text-align: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a0505 0%, #2d0a0a 40%, #0f1a2d 100%);
  z-index: 0;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orbFloat 8s ease-in-out infinite alternate;
}
.orb-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #ef4444, transparent);
  top: -100px; left: -60px;
  animation-duration: 9s;
}
.orb-2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #f59e0b, transparent);
  top: -30px; right: -60px;
  animation-duration: 11s;
  animation-delay: -2s;
}
@keyframes orbFloat {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(25px, 15px) scale(1.1); }
}

.particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.particle {
  position: absolute;
  font-size: 1.1rem;
  opacity: 0;
  animation: particleFall 12s linear infinite;
}
.p1 { left: 10%; animation-delay: 0s; }
.p2 { left: 25%; animation-delay: 3s; animation-duration: 9s; font-size: 0.9rem; }
.p3 { left: 40%; animation-delay: 6s; animation-duration: 14s; }
.p4 { left: 55%; animation-delay: 1s; animation-duration: 11s; }
.p5 { left: 70%; animation-delay: 5s; font-size: 1.3rem; }
.p6 { left: 82%; animation-delay: 8s; animation-duration: 10s; }
.p7 { left: 18%; animation-delay: 10s; animation-duration: 13s; }
.p8 { left: 90%; animation-delay: 4s; font-size: 0.8rem; }

@keyframes particleFall {
  0%   { transform: translateY(-5vh) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(110vh) rotate(540deg); opacity: 0; }
}

.hero-content { position: relative; z-index: 2; max-width: 650px; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  margin-bottom: 1.5rem;
}

.badge-dot {
  width: 6px; height: 6px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulseDot 2s ease-in-out infinite;
}
@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(1.4); }
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  color: #f8fafc;
  margin: 0 0 1rem;
  letter-spacing: -1px;
}
.hero-title em { font-style: normal; color: #f87171; }

.title-gradient {
  background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e);
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
  font-size: 1.05rem;
  color: rgba(248, 250, 252, 0.6);
  margin: 0;
  line-height: 1.6;
}

.scroll-hint {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.scroll-arrow {
  width: 22px; height: 22px;
  border-right: 2px solid rgba(255,255,255,0.3);
  border-bottom: 2px solid rgba(255,255,255,0.3);
  transform: rotate(45deg);
  animation: scrollBounce 1.5s ease-in-out infinite;
}
@keyframes scrollBounce {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.4; }
  50%       { transform: rotate(45deg) translateY(6px); opacity: 1; }
}

/* ════════ CARDS SECTION ════════ */
.cards-section {
  padding: 4rem 1.5rem 5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

/* ════════ CARD ════════ */
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
  opacity: 0;
  transform: translateY(30px);
  animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--delay);
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
    0 0 40px color-mix(in srgb, var(--accent) 15%, transparent);
  border-color: var(--accent);
}

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

.card-image {
  position: relative;
  height: 240px;
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
.card:hover .card-image img { transform: scale(1.08); }

.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.45) 100%);
}

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

.card-emoji {
  position: absolute;
  bottom: 14px;
  right: 16px;
  font-size: 2.8rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 2;
  line-height: 1;
}
.card:hover .card-emoji { transform: scale(1.2) rotate(-8deg); }

.card-body {
  padding: 1.5rem 1.6rem 1.8rem;
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
  margin-bottom: 0.9rem;
}

.meta-pill {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
}

.meta-controls {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 700;
}

.card-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0 0 0.6rem;
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
.card:hover .card-cta { background: var(--accent); border-color: var(--accent); }

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
.card:hover .cta-arrow { transform: translateX(5px); color: #fff; }

.card-accent-bar {
  height: 4px;
  background: linear-gradient(90deg, var(--accent), var(--tag-color));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.card:hover .card-accent-bar { transform: scaleX(1); }

/* ════════ RESPONSIVE ════════ */
@media (min-width: 768px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .hero { padding: 4rem 1.5rem 3rem; min-height: 320px; }
  .cards-section { padding: 2.5rem 1rem 4rem; }
  .cards-grid { grid-template-columns: 1fr; }
  .card-image { height: 200px; }
}
</style>
