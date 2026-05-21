<script setup>
/**
 * BetaScreen.vue — Pura Vida Runner 🏃
 * Endless runner educativo con elementos de Costa Rica.
 * Rediseño visual prémium con estética Glassmorphism, HUD flotante y controles táctiles avanzados.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { CW, CH, makeState, update, render, sfx, ITEMS } from '../../composables/useRunner.js'

const router  = useRouter()
const canvasRef = ref(null)

// UI reactiva
const phase   = ref('start')   // 'start' | 'playing' | 'gameover'
const paused  = ref(false)     // Reactivo para el overlay de pausa
const uiScore = ref(0)
const uiLives = ref(3)
const uiBest  = ref(0)
const uiSpeedMult = ref('1.0')
const finalScore = ref(0)

// Game state puro JS
let gs       = null
let keys     = {}
let animId   = null
let lastTime = null

// ── CONTROLES ────────────────────────────────────────────────────────────
function onKeyDown(e) {
  keys[e.key] = true
  if (['ArrowUp','w',' '].includes(e.key) && gs?.player?.onGround) {
    gs.player.vy = -640; gs.player.onGround = false; sfx.jump()
  }
  if (e.key==='p'||e.key==='P') togglePause()
  if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault()
}
function onKeyUp(e) { keys[e.key] = false }

function touchLeft(v)  { keys['ArrowLeft']  = v }
function touchRight(v) { keys['ArrowRight'] = v }
function doJump()      { if (gs?.player?.onGround) { gs.player.vy=-640; gs.player.onGround=false; sfx.jump() } }

// ── GAME LOOP ─────────────────────────────────────────────────────────────
function loop(ts) {
  if (phase.value !== 'playing') return
  if (lastTime === null) lastTime = ts
  const dt = Math.min((ts - lastTime) / 1000, 0.05)
  lastTime = ts

  if (!paused.value) {
    update(gs, dt, keys,
      (finalSc) => { finalScore.value = finalSc; endGame() },
      (s)       => {
        uiScore.value = s
        uiLives.value = gs.lives
        uiSpeedMult.value = (gs.worldSpd / 210).toFixed(1) // 210 = BASE_SPD
      }
    )
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) render(ctx, gs, uiScore.value, uiLives.value, uiBest.value)
  }
  animId = requestAnimationFrame(loop)
}

// ── FASES ─────────────────────────────────────────────────────────────────
function startGame() {
  keys = {}; paused.value = false; lastTime = null
  gs = makeState()
  uiScore.value = 0; uiLives.value = 3; uiSpeedMult.value = '1.0'
  phase.value = 'playing'
  animId = requestAnimationFrame(loop)
}

function endGame() {
  cancelAnimationFrame(animId); animId = null
  if (finalScore.value > uiBest.value) {
    uiBest.value = finalScore.value
    localStorage.setItem('pvq_runner_best', finalScore.value)
  }
  phase.value = 'gameover'
}

function togglePause() {
  if (phase.value !== 'playing') return
  paused.value = !paused.value
}

function endGameForced() {
  paused.value = false
  finalScore.value = uiScore.value
  endGame()
}

// ── LIFECYCLE ─────────────────────────────────────────────────────────────
onMounted(() => {
  const saved = localStorage.getItem('pvq_runner_best')
  if (saved) uiBest.value = parseInt(saved)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup',   onKeyUp)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup',   onKeyUp)
})
</script>

<template>
  <div class="runner-wrap">

    <!-- HEADER REDISEÑADO (Glassmorphic Top Bar) -->
    <div class="runner-header-glass">
      <button class="btn-back-glow" @click="router.push('/minijuegos')">
        <span class="btn-icon">⬅</span> Volver
      </button>
      <div class="title-block">
        <h1 class="runner-title">🏃 Pura Vida Runner</h1>
        <p class="runner-sub">Esquivá obstáculos y recolectá la biodiversidad de Costa Rica</p>
      </div>
      <div class="hud-top-record" v-if="uiBest > 0">
        <span class="record-label">🏆 RÉCORD</span>
        <span class="record-val">{{ uiBest }}</span>
      </div>
    </div>

    <!-- CANVAS + OVERLAYS CONTENEDOR PRINCIPAL -->
    <div class="canvas-wrap-premium">
      
      <!-- HUD FLOATING ARCADE HTML -->
      <div v-if="phase === 'playing'" class="arcade-hud">
        <div class="hud-left-glass">
          <div class="hud-stat">
            <span class="hud-lbl">⭐ PUNTAJE</span>
            <span class="hud-val pulse-slow">{{ uiScore }}</span>
          </div>
          <div class="hud-stat speed-badge" :class="{ 'hyper-speed': parseFloat(uiSpeedMult) >= 1.5 }">
            <span class="hud-lbl">⚡ VELOCIDAD</span>
            <span class="hud-val">x{{ uiSpeedMult }}</span>
          </div>
        </div>

        <div class="hud-right-glass">
          <div class="lives-box">
            <span v-for="i in 3" :key="i" class="heart-icon" :class="{ 'active': i <= uiLives, 'broken': i > uiLives }">
              ❤️
            </span>
          </div>
          <button class="btn-pause-circle" @click="togglePause" :title="paused ? 'Reanudar' : 'Pausar'">
            {{ paused ? '▶' : '⏸' }}
          </button>
        </div>
      </div>

      <!-- OVERLAY INICIO (Glassmorphism de alta gama) -->
      <Transition name="scale-fade">
        <div v-if="phase==='start'" class="overlay-glass">
          <div class="ov-card glass-card start-card">
            <div class="card-neon-border"></div>
            <div class="ov-icon bounce-animation">🌴</div>
            <h2 class="card-title text-glow-cyan">¡Pura Vida Runner!</h2>
            <p class="card-desc">Corré por los paisajes ticos, recogé elementos de la biodiversidad costarricense y esquivá los peligros de la selva.</p>
            
            <div class="controls-legend-grid">
              <div class="legend-col">
                <span class="legend-key">⬅ A / ←</span>
                <span class="legend-desc">Moverse a la izquierda</span>
              </div>
              <div class="legend-col">
                <span class="legend-key">➡ D / →</span>
                <span class="legend-desc">Moverse a la derecha</span>
              </div>
              <div class="legend-col">
                <span class="legend-key">⬆ W / ↑ / Espacio</span>
                <span class="legend-desc">Saltar obstáculos</span>
              </div>
              <div class="legend-col">
                <span class="legend-key">P</span>
                <span class="legend-desc">Pausar partida</span>
              </div>
            </div>

            <div class="showcase-wrap">
              <span class="showcase-title">Coleccionables Especiales:</span>
              <div class="items-showcase-row">
                <span v-for="it in ITEMS" :key="it.emoji" class="showcase-item" :style="{ '--glow-color': it.color }" :title="it.label">
                  <span class="emoji-bubble">{{ it.emoji }}</span>
                  <span class="emoji-points">+{{ it.pts }}</span>
                </span>
              </div>
            </div>

            <button id="btn-start" class="btn-action-primary glow-green" @click="startGame">
              ¡Comenzar Carrera!
            </button>
          </div>
        </div>
      </Transition>

      <!-- OVERLAY PAUSA (Glassmorphic blur extremo) -->
      <Transition name="fade">
        <div v-if="phase==='playing' && paused" class="overlay-glass pause-overlay">
          <div class="ov-card glass-card pause-card">
            <div class="card-neon-border amber"></div>
            <div class="ov-icon pulse-animation">⏸</div>
            <h2 class="card-title text-glow-amber">Carrera en Pausa</h2>
            <p class="card-desc">Has pausado tu trayecto en la selva. ¿Listo para continuar?</p>
            
            <div class="pause-stats">
              <div class="p-stat-box">
                <span class="lbl">SCORE ACTUAL</span>
                <span class="val">{{ uiScore }}</span>
              </div>
              <div class="p-stat-box" v-if="uiBest > 0">
                <span class="lbl">RÉCORD</span>
                <span class="val text-amber">🏆 {{ uiBest }}</span>
              </div>
            </div>

            <div class="buttons-stack">
              <button class="btn-action-primary glow-cyan" @click="togglePause">
                Continuar Corriendo
              </button>
              <button class="btn-action-secondary" @click="endGameForced">
                Terminar y Guardar Score
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- OVERLAY GAME OVER -->
      <Transition name="scale-fade">
        <div v-if="phase==='gameover'" class="overlay-glass">
          <div class="ov-card glass-card gameover-card">
            <div class="card-neon-border pink"></div>
            <div class="ov-icon shake-animation">💀</div>
            <h2 class="card-title text-glow-pink">¡Fin del Recorrido!</h2>
            
            <div class="gameover-stats-grid">
              <div class="go-stat-box">
                <span class="lbl">SCORE OBTENIDO</span>
                <span class="val">{{ finalScore }}</span>
              </div>
              <div class="go-stat-box gold-border" v-if="uiBest > 0">
                <span class="lbl">RÉCORD ACTUAL</span>
                <span class="val text-gold">🏆 {{ uiBest }}</span>
              </div>
            </div>

            <div v-if="finalScore >= uiBest && uiBest > 0" class="new-record-badge animate-pulse">
              🎉 ¡NUEVO RÉCORD DE LA SELVA! 🎉
            </div>

            <div class="buttons-stack">
              <button id="btn-retry" class="btn-action-primary glow-green" @click="startGame">
                Intentar de Nuevo
              </button>
              <button class="btn-action-secondary" @click="router.push('/minijuegos')">
                Salir al Menú
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <canvas ref="canvasRef" :width="CW" :height="CH" class="game-canvas" />
    </div>

    <!-- MANDOS TÁCTILES REDISEÑADOS ESTILO PORTÁTIL PREMIUM -->
    <div class="touch-gamepad">
      <div class="gamepad-dpad">
        <button class="gp-btn arrow-btn left"
          @pointerdown="touchLeft(true)" @pointerup="touchLeft(false)" @pointerleave="touchLeft(false)">
          <span class="arrow-shape">◀</span>
        </button>
        <button class="gp-btn arrow-btn right"
          @pointerdown="touchRight(true)" @pointerup="touchRight(false)" @pointerleave="touchRight(false)">
          <span class="arrow-shape">▶</span>
        </button>
      </div>
      <div class="gamepad-actions">
        <button class="gp-btn-action jump-btn" @pointerdown="doJump">
          <span class="btn-light"></span>
          <span class="btn-symbol">▲</span>
          <span class="btn-label">SALTAR</span>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&display=swap');

.runner-wrap {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 1rem 1rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  font-family: 'Outfit', sans-serif;
  color: #f8fafc;
  user-select: none;
}

/* HEADER REDISEÑADO */
.runner-header-glass {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.title-block {
  text-align: center;
  flex: 1;
  min-width: 0;
}

.runner-title {
  font-size: 1.45rem;
  font-weight: 900;
  color: #38bdf8;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.45);
  margin: 0;
  letter-spacing: -0.5px;
}

.runner-sub {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0.15rem 0 0;
  font-weight: 500;
}

.btn-back-glow {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  padding: 0.55rem 1.2rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-back-glow:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  transform: translateX(-3px);
}

.hud-top-record {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.45rem 1rem;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.08);
}

.record-label {
  font-size: 0.65rem;
  color: #fbbf24;
  font-weight: 900;
  letter-spacing: 0.8px;
}

.record-val {
  font-size: 1.05rem;
  font-weight: 900;
  color: #fef08a;
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.3);
}

/* CANVAS Y CONTENEDOR PREMIUM */
.canvas-wrap-premium {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* Relación 800:450 */
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: #090d16;
}

.game-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* HUD FLOATING HTML PREMIUM */
.arcade-hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.85rem 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 5;
  pointer-events: none; /* Dejar pasar clics */
}

.hud-left-glass, .hud-right-glass {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.5rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  pointer-events: auto; /* Reactivar clics en los elementos del HUD */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.hud-stat {
  display: flex;
  flex-direction: column;
}

.hud-lbl {
  font-size: 0.6rem;
  color: #94a3b8;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.hud-val {
  font-size: 1.15rem;
  font-weight: 900;
  color: #ffffff;
}

.speed-badge {
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.speed-badge.hyper-speed {
  background: rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.4);
  box-shadow: 0 0 10px rgba(236, 72, 153, 0.2);
  animation: shake-micro 0.2s infinite alternate;
}

.speed-badge.hyper-speed .hud-val {
  color: #f472b6;
  text-shadow: 0 0 8px rgba(236, 72, 153, 0.4);
}

.lives-box {
  display: flex;
  gap: 0.35rem;
}

.heart-icon {
  font-size: 1.15rem;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.heart-icon.active {
  animation: beat 1.4s infinite alternate;
}

.heart-icon.broken {
  opacity: 0.25;
  filter: grayscale(1);
  transform: scale(0.85);
}

.btn-pause-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-pause-circle:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* OVERLAYS EN GAMA PREMIUM (GLASSMORPHIC) */
.overlay-glass {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 12, 24, 0.75);
  backdrop-filter: blur(14px);
  padding: 1rem;
}

.glass-card {
  position: relative;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 2.2rem 2rem;
  width: min(440px, 95%);
  text-align: center;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
}

.card-neon-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #06b6d4, #3b82f6);
}

.card-neon-border.amber {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.card-neon-border.pink {
  background: linear-gradient(90deg, #ec4899, #f43f5e);
}

.ov-icon {
  font-size: 2.6rem;
  line-height: 1;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.15));
}

.card-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
}

.text-glow-green {
  color: #10b981;
  text-shadow: 0 0 12px rgba(16, 185, 129, 0.65);
}

.text-glow-cyan {
  color: #22d3ee;
  text-shadow: 0 0 15px rgba(34, 211, 238, 0.7);
}

.text-glow-amber {
  color: #fbbf24;
  text-shadow: 0 0 15px rgba(251, 191, 36, 0.7);
}

.text-glow-pink {
  color: #f43f5e;
  text-shadow: 0 0 15px rgba(244, 63, 94, 0.7);
}

.card-desc {
  color: #94a3b8;
  font-size: 0.88rem;
  line-height: 1.45;
  margin: 0;
}

/* LEYENDA DE CONTROLES INICIO */
.controls-legend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 0.8rem 1rem;
  width: 100%;
  text-align: left;
}

.legend-col {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.legend-key {
  font-size: 0.75rem;
  color: #e2e8f0;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  width: fit-content;
}

.legend-desc {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
}

/* ESCAPARATE DE COLECCIONABLES */
.showcase-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.showcase-title {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.items-showcase-row {
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
}

.showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.35rem 0.55rem;
  position: relative;
  transition: transform 0.2s ease;
}

.showcase-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 10px var(--glow-color);
  border-color: var(--glow-color);
}

.emoji-bubble {
  font-size: 1.4rem;
  line-height: 1;
  filter: drop-shadow(0 0 6px var(--glow-color));
}

.emoji-points {
  font-size: 0.65rem;
  color: #a7f3d0;
  font-weight: 900;
  margin-top: 0.1rem;
}

/* ESTADISTICAS PAUSA Y GAMEOVER */
.pause-stats, .gameover-stats-grid {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.p-stat-box, .go-stat-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 0.7rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.go-stat-box.gold-border {
  border-color: rgba(245, 158, 11, 0.25);
  background: rgba(245, 158, 11, 0.02);
}

.lbl {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.val {
  font-size: 1.6rem;
  font-weight: 900;
  color: #ffffff;
  margin-top: 0.1rem;
}

.text-gold {
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
}

.new-record-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border: 1px solid #fef08a;
  color: #0f172a;
  padding: 0.45rem 1.4rem;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.82rem;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  letter-spacing: 0.2px;
}

.buttons-stack {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
}

/* BOTONES DE ACCION ARCADE */
.btn-action-primary {
  width: 100%;
  color: white;
  border: none;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 900;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
}

.glow-green {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
}
.glow-green:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
}

.glow-cyan {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 0 5px 15px rgba(6, 182, 212, 0.3);
}
.glow-cyan:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.5);
}

.btn-action-secondary {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* MANDOS TÁCTILES PORTÁTILES (PREMIUM GAMEPAD) */
.touch-gamepad {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.gamepad-dpad {
  display: flex;
  gap: 1rem;
}

.gp-btn {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: radial-gradient(circle, #1e293b, #0f172a);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.05);
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  touch-action: none;
}

.gp-btn:active {
  transform: scale(0.9) translateY(2px);
  border-color: #3b82f6;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), inset 0 1px 2px rgba(0, 0, 0, 0.5);
  color: #60a5fa;
}

.arrow-shape {
  font-size: 1.4rem;
  line-height: 1;
  text-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
}

.gp-btn-action {
  position: relative;
  width: 90px;
  height: 66px;
  border-radius: 20px;
  background: linear-gradient(135deg, #10b981, #047857);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.25);
  touch-action: none;
}

.btn-light {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  border-radius: 99px;
  background: #6ee7b7;
  opacity: 0.7;
}

.btn-symbol {
  font-size: 1.1rem;
  font-weight: 900;
  line-height: 1;
}

.btn-label {
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.gp-btn-action:active {
  transform: scale(0.92) translateY(2px);
  background: linear-gradient(135deg, #059669, #065f46);
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
}

/* ANIMACIONES */
@keyframes beat {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}

@keyframes bounce-animation {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.bounce-animation {
  animation: bounce-animation 2s infinite ease-in-out;
}

@keyframes pulse-animation {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.08); opacity: 1; }
}
.pulse-animation {
  animation: pulse-animation 1.5s infinite alternate ease-in-out;
}

@keyframes shake-micro {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  100% { transform: translate(-1px, -1px) rotate(0.5deg); }
}

/* TRANSICIONES VUE */
.scale-fade-enter-active, .scale-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-fade-enter-from, .scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .runner-title { font-size: 1.15rem; }
  .runner-sub { font-size: 0.7rem; }
  .gp-btn { width: 54px; height: 54px; }
  .gp-btn-action { width: 80px; height: 58px; }
  .hud-left-glass, .hud-right-glass { padding: 0.4rem 0.7rem; gap: 0.6rem; }
  .hud-val { font-size: 0.95rem; }
}
</style>
