<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CW, CH, drawArena, sfx } from '../../composables/useFightGame.js'
import { updateEngine } from '../../game/engine.js'
import { drawFlash } from '../../game/effects.js'
import { drawPixelSprite, drawPixelShadow } from '../../game/sprites.js'
import PixelPreview from './PixelPreview.vue'

import HUD from './HUD.vue'

const props = defineProps({
  gs: Object,
  keys: Object,
  sfx: Object,
  isFullscreen: Boolean
})

const emit = defineEmits(['restart', 'exit', 'toggleFs'])

const canvasRef = ref(null)
let animId = null
let lastTime = null
let crowdSfx = null

// ── Pixel art particles (cuadradas, no redondas)
function drawParticles(ctx, particles) {
  for (const p of particles) {
    if (p.life <= 0) continue
    ctx.globalAlpha = Math.max(0, p.life)
    ctx.fillStyle = p.color
    // Pixel art: cuadrados en vez de círculos
    const size = Math.max(2, Math.round(p.r / 2) * 2)
    ctx.fillRect(Math.round(p.x - size / 2), Math.round(p.y - size / 2), size, size)
  }
  ctx.globalAlpha = 1
}

// ── Overlay de scanlines CRT
function drawScanlines(ctx) {
  ctx.save()
  ctx.globalAlpha = 0.06
  for (let y = 0; y < CH; y += 2) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, y, CW, 1)
  }
  ctx.globalAlpha = 0.03
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, CW, CH)
  ctx.restore()
}

// ── Countdown pixel art
function drawCountdown(ctx, gs) {
  if (gs.phase !== 'countdown') return
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fillRect(0, 0, CW, CH)
  const n = Math.ceil(gs.countdown)
  const txt = n > 0 ? String(n) : 'FIGHT!'
  // Pixel font effect: shadow offset
  ctx.imageSmoothingEnabled = false
  ctx.font = 'bold 96px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#000'
  ctx.fillText(txt, CW / 2 + 4, CH / 2 + 4)
  ctx.fillStyle = n > 0 ? '#fbbf24' : '#22c55e'
  ctx.fillText(txt, CW / 2, CH / 2)
  ctx.restore()
}


const loop = (ts) => {
  if (!lastTime) lastTime = ts
  const dt = Math.min((ts - lastTime) / 1000, 0.05)
  lastTime = ts

  updateEngine(props.gs, dt, props.keys, props.sfx)

  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) {
    ctx.imageSmoothingEnabled = false // CRÍTICO para pixel art

    ctx.save()
    if (props.gs.screenShake > 0) {
      const shake = Math.round(props.gs.screenShake * 8)
      ctx.translate(
        (Math.random() - 0.5) * shake,
        (Math.random() - 0.5) * shake
      )
    }

    // Fondo
    drawArena(ctx, props.gs.crowdAnim || 0, props.gs.bgImg)

    // Overlay oscuro para contraste pixel art
    ctx.fillStyle = 'rgba(0,0,0,0.18)'
    ctx.fillRect(0, 0, CW, CH)

    // Sombras en suelo
    drawPixelShadow(ctx, props.gs.p1, 370)
    drawPixelShadow(ctx, props.gs.p2, 370)

    // Partículas pixel art
    drawParticles(ctx, props.gs.particles || [])

    // Sprites pixel art
    drawPixelSprite(ctx, props.gs.p1, props.gs.p1.animT)
    drawPixelSprite(ctx, props.gs.p2, props.gs.p2.animT)

    // Hit flash
    drawFlash(ctx, CW, CH, props.gs.hitFlash || 0)

    // Countdown
    drawCountdown(ctx, props.gs)

    // Scanlines CRT
    drawScanlines(ctx)

    ctx.restore()
  }

  animId = requestAnimationFrame(loop)
}

onMounted(() => {
  animId = requestAnimationFrame(loop)
  if (props.sfx?.crowd) crowdSfx = props.sfx.crowd()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (crowdSfx) crowdSfx.stop()
})
</script>

<template>
  <div class="game-container" :class="{ 'is-fs': isFullscreen }">
    <div class="game-wrap">
      <!-- HUD Overlay -->
      <HUD :gs="gs" />

      <canvas
        ref="canvasRef"
        :width="CW"
        :height="CH"
        class="game-canvas"
      />

      <button class="fs-toggle" @click="$emit('toggleFs')">
        {{ isFullscreen ? '⇲' : '⇱' }}
      </button>

      <!-- Result Overlay - estilo pixel art -->
      <Transition name="px-fade">
        <div v-if="gs.phase === 'result'" class="result-screen">
          <div class="result-box">
            <div class="result-title">VICTORIA!</div>
            <div class="winner-row">
              <PixelPreview :fighter="gs[gs.winner]" :scale="1.2" :animate="true" />
              <span class="winner-name">{{ gs[gs.winner]?.name?.toUpperCase() }}</span>
            </div>
            <div class="result-btns">
              <button class="px-btn primary" @click="$emit('restart')">REVANCHA</button>
              <button class="px-btn secondary" @click="$emit('exit')">SALIR</button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #020617;
}

.game-container.is-fs {
  background: #000;
}

.game-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 1200px; 
  max-height: 100vh;
  box-shadow: 0 0 100px rgba(0,0,0,0.9);
  border: 4px solid #000;
  overflow: hidden;
}

.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
  background: #000;
}

.fs-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.5);
  border: 2px solid rgba(255,255,255,0.2);
  color: #fff;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  font-size: 1.2rem;
  transition: all 0.2s;
}
.fs-toggle:hover {
  background: rgba(255,255,255,0.1);
  border-color: #fbbf24;
  color: #fbbf24;
}

/* ── RESULT SCREEN PIXEL ART ── */
.result-screen {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
}

.result-box {
  background: #0f172a;
  border: 4px solid #fbbf24;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 0 50px rgba(251, 191, 36, 0.2);
  animation: resultIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes resultIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.result-title {
  font-family: 'Outfit', sans-serif;
  font-size: 4rem;
  font-weight: 950;
  color: #fbbf24;
  letter-spacing: 8px;
  text-shadow: 4px 4px 0 #92400e;
  margin-bottom: 2rem;
}

.winner-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.1);
}

.winner-name {
  font-family: monospace;
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 4px;
}

.result-btns { display: flex; gap: 1.5rem; justify-content: center; }

.px-btn {
  font-family: monospace;
  font-weight: 900;
  font-size: 1.2rem;
  letter-spacing: 2px;
  padding: 1rem 2.5rem;
  border: 3px solid #000;
  cursor: pointer;
  transition: all 0.1s;
}

.px-btn.primary {
  background: #22c55e;
  color: #000;
  box-shadow: 6px 6px 0 #14532d;
}
.px-btn.primary:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 #14532d; }
.px-btn.primary:active { transform: translate(4px, 4px); box-shadow: 0 0 0 #14532d; }

.px-btn.secondary {
  background: #334155;
  color: #fff;
  box-shadow: 6px 6px 0 #0f172a;
}
.px-btn.secondary:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 #0f172a; }

.px-fade-enter-active { transition: opacity 0.4s; }
.px-fade-leave-active { transition: opacity 0.3s; }
.px-fade-enter-from, .px-fade-leave-to { opacity: 0; }
</style>
