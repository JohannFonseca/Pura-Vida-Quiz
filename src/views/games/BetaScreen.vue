<script setup>
/**
 * BetaScreen.vue — Pura Vida Runner 🏃
 * Endless runner educativo con elementos de Costa Rica.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { CW, CH, makeState, update, render, sfx } from '../../composables/useRunner.js'

const router  = useRouter()
const canvasRef = ref(null)

// UI reactiva
const phase   = ref('start')   // 'start' | 'playing' | 'paused' | 'gameover'
const uiScore = ref(0)
const uiLives = ref(3)
const uiBest  = ref(0)
const finalScore = ref(0)

// Game state puro JS
let gs       = null
let keys     = {}
let paused   = false
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
  if (!paused) {
    update(gs, dt, keys,
      (finalSc) => { finalScore.value = finalSc; endGame() },
      (s)       => { uiScore.value = s; uiLives.value = gs.lives }
    )
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) render(ctx, gs, uiScore.value, uiLives.value, uiBest.value)
  }
  animId = requestAnimationFrame(loop)
}

// ── FASES ─────────────────────────────────────────────────────────────────
function startGame() {
  keys = {}; paused = false; lastTime = null
  gs = makeState()
  uiScore.value = 0; uiLives.value = 3
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
  paused = !paused
  // Dibujar pausa sobre el canvas
  if (paused) {
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'rgba(15,23,42,0.55)'
      ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = 'white'; ctx.font = 'bold 48px system-ui'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('⏸ Pausado', CW/2, CH/2)
      ctx.font = '18px system-ui'; ctx.fillStyle='rgba(255,255,255,0.7)'
      ctx.fillText('Presioná P para continuar', CW/2, CH/2+50)
    }
  }
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

    <!-- HEADER -->
    <div class="runner-header">
      <button class="btn-back" @click="router.push('/jugar')">⬅ Volver</button>
      <div class="title-block">
        <h1 class="runner-title">🏃 Pura Vida Runner</h1>
        <p class="runner-sub">Recoge elementos de Costa Rica y esquivá obstáculos</p>
      </div>
      <div class="hud-chips">
        <span class="chip score-chip">⭐ {{ uiScore }}</span>
        <span v-if="uiBest>0" class="chip best-chip">🏆 {{ uiBest }}</span>
      </div>
    </div>

    <!-- CANVAS + OVERLAYS -->
    <div class="canvas-wrap">

      <!-- START -->
      <Transition name="fade">
        <div v-if="phase==='start'" class="overlay">
          <div class="ov-card">
            <span class="ov-icon">🌴</span>
            <h2>¡Pura Vida Runner!</h2>
            <p>Recogé elementos ticos, esquivá obstáculos y batí tu récord</p>
            <div class="controls-grid">
              <span>⬅ A / ←</span><span>mover izquierda</span>
              <span>➡ D / →</span><span>mover derecha</span>
              <span>⬆ W / ↑ / Espacio</span><span>saltar</span>
              <span>P</span><span>pausar</span>
            </div>
            <div class="items-preview">
              <span v-for="it in [{e:'🌸'},{e:'🐸'},{e:'☕'},{e:'🌋'},{e:'🐢'}]" :key="it.e" class="prev-item">{{ it.e }}</span>
            </div>
            <button id="btn-start" class="btn-primary" @click="startGame">¡Empezar!</button>
          </div>
        </div>
      </Transition>

      <!-- GAME OVER -->
      <Transition name="fade">
        <div v-if="phase==='gameover'" class="overlay">
          <div class="ov-card">
            <span class="ov-icon">😅</span>
            <h2>¡Game Over!</h2>
            <div class="score-row">
              <div class="score-stat">
                <span class="stat-n">{{ finalScore }}</span>
                <span class="stat-l">Puntaje</span>
              </div>
              <div class="score-stat" v-if="uiBest>0">
                <span class="stat-n gold">{{ uiBest }}</span>
                <span class="stat-l">🏆 Récord</span>
              </div>
            </div>
            <p v-if="finalScore>=uiBest && uiBest>0" class="new-record">🎉 ¡Nuevo récord!</p>
            <div class="ov-btns">
              <button id="btn-retry" class="btn-primary" @click="startGame">Volver a intentar</button>
              <button class="btn-secondary" @click="router.push('/jugar')">Salir</button>
            </div>
          </div>
        </div>
      </Transition>

      <canvas ref="canvasRef" :width="CW" :height="CH" class="game-canvas" />
    </div>

    <!-- CONTROLES TÁCTILES -->
    <div class="touch-row">
      <button class="touch-btn"
        @pointerdown="touchLeft(true)" @pointerup="touchLeft(false)" @pointerleave="touchLeft(false)">◀</button>
      <button class="touch-btn jump-btn" @pointerdown="doJump">⬆ Saltar</button>
      <button class="touch-btn"
        @pointerdown="touchRight(true)" @pointerup="touchRight(false)" @pointerleave="touchRight(false)">▶</button>
    </div>

  </div>
</template>

<style scoped>
.runner-wrap {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 1rem 1rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* HEADER */
.runner-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
  background: white; border-radius: 16px; padding: 1rem 1.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06); border: 1px solid var(--border-color);
}
.title-block { text-align: center; flex: 1; min-width: 0; }
.runner-title { font-size: 1.35rem; font-weight: 900; color: var(--text-main); margin: 0; }
.runner-sub   { font-size: 0.82rem; color: var(--text-muted); margin: 0; }

.btn-back {
  background: #f1f5f9; border: 1px solid var(--border-color);
  color: var(--text-main); padding: .55rem 1.1rem; border-radius: 999px;
  font-size: .9rem; font-weight: 700; cursor: pointer; transition: all .2s; white-space: nowrap;
}
.btn-back:hover { background: #e2e8f0; transform: translateX(-2px); }

.hud-chips { display: flex; gap: .5rem; flex-shrink: 0; }
.chip { padding: .45rem 1rem; border-radius: 999px; font-weight: 900; font-size: .95rem; white-space: nowrap; }
.score-chip { background: linear-gradient(135deg,#22c55e,#16a34a); color: white; box-shadow: 0 4px 12px rgba(34,197,94,.3); }
.best-chip  { background: linear-gradient(135deg,#fbbf24,#f59e0b); color: white; box-shadow: 0 4px 12px rgba(251,191,36,.3); }

/* CANVAS */
.canvas-wrap {
  position: relative; width: 100%; height: 0;
  padding-bottom: 56.25%; /* 450/800 */
  border-radius: 18px; overflow: hidden;
  box-shadow: 0 14px 40px rgba(0,0,0,0.14); border: 2px solid var(--border-color);
  background: #38bdf8;
}
.game-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; }

/* OVERLAYS */
.overlay {
  position: absolute; inset: 0; z-index: 10;
  display: flex; align-items: center; justify-content: center;
  background: rgba(15,23,42,.6); backdrop-filter: blur(6px);
}
.ov-card {
  background: white; border-radius: 22px; padding: 2rem;
  width: min(380px,90%); text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,.25);
  display: flex; flex-direction: column; align-items: center; gap: .8rem;
}
.ov-icon { font-size: 3rem; line-height: 1; }
.ov-card h2 { font-size: 1.6rem; font-weight: 900; color: var(--text-main); margin: 0; }
.ov-card p  { color: var(--text-muted); font-size: .95rem; margin: 0; }

.controls-grid {
  display: grid; grid-template-columns: auto 1fr; gap: .3rem .8rem;
  background: #f8fafc; border-radius: 12px; padding: .75rem 1rem;
  font-size: .82rem; color: var(--text-muted); font-weight: 600; text-align: left; width: 100%;
}
.items-preview { display: flex; gap: .5rem; font-size: 1.6rem; }
.prev-item { animation: bounce 2s ease-in-out infinite; }
.prev-item:nth-child(2) { animation-delay: .2s; }
.prev-item:nth-child(3) { animation-delay: .4s; }
.prev-item:nth-child(4) { animation-delay: .6s; }
.prev-item:nth-child(5) { animation-delay: .8s; }
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

.score-row { display: flex; gap: 2rem; justify-content: center; }
.score-stat { display: flex; flex-direction: column; align-items: center; }
.stat-n { font-size: 2.2rem; font-weight: 900; color: var(--text-main); }
.stat-n.gold { color: #d97706; }
.stat-l { font-size: .8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }
.new-record { background: #fef9c3; border: 1.5px solid #fbbf24; color: #92400e; padding: .4rem 1rem; border-radius: 999px; font-weight: 800; font-size: .9rem; }

.ov-btns { display: flex; flex-direction: column; gap: .6rem; width: 100%; }

/* BOTONES */
.btn-primary {
  width: 100%; background: linear-gradient(135deg,#22c55e,#16a34a); color: white;
  border: none; padding: .85rem; font-size: 1rem; font-weight: 800;
  border-radius: 999px; cursor: pointer; transition: all .2s;
  box-shadow: 0 5px 14px rgba(34,197,94,.35);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(34,197,94,.4); }
.btn-secondary {
  width: 100%; background: white; color: var(--text-main);
  border: 2px solid var(--border-color); padding: .8rem;
  font-size: .95rem; font-weight: 700; border-radius: 999px; cursor: pointer; transition: all .2s;
}
.btn-secondary:hover { background: #f1f5f9; }

/* TRANSICIÓN */
.fade-enter-active,.fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from,.fade-leave-to { opacity: 0; }

/* TÁCTILES */
.touch-row { display: flex; justify-content: center; gap: 1rem; }
.touch-btn {
  background: white; border: 2px solid var(--border-color); color: var(--text-main);
  font-size: 1.1rem; font-weight: 800; padding: .85rem 1.6rem; border-radius: 14px;
  cursor: pointer; transition: transform .1s; box-shadow: 0 4px 10px rgba(0,0,0,.07);
  user-select: none; touch-action: none;
}
.touch-btn:active { transform: scale(.94); background: #f1f5f9; }
.jump-btn {
  background: linear-gradient(135deg,#22c55e,#16a34a); color: white;
  border-color: transparent; padding: .85rem 2.2rem;
  box-shadow: 0 4px 14px rgba(34,197,94,.3);
}
.jump-btn:active { background: #16a34a; }

@media (max-width:600px) {
  .runner-title { font-size: 1.05rem; }
  .touch-btn { padding: .8rem 1.2rem; }
  .jump-btn  { padding: .8rem 1.6rem; }
}
</style>
