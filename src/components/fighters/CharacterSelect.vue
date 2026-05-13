<script setup>
import { ref } from 'vue'
import { FIGHTERS } from '../../data/fighters.js'
import { sfx } from '../../composables/useFightGame.js'
import PixelPreview from './PixelPreview.vue'

const emit = defineEmits(['select'])

const p1Choice = ref(FIGHTERS[0])
const p2Choice = ref(FIGHTERS[1])
const difficulty = ref('medium')
const hoveredP1 = ref(FIGHTERS[0])
// P2 muestra siempre el seleccionado (clic derecho), sin hover

const selectP1 = (f) => {
  if (f.locked) return
  if (p2Choice.value.id === f.id) return
  p1Choice.value = f
  hoveredP1.value = f
  sfx.select()
}
const selectP2 = (f) => {
  if (f.locked) return
  if (p1Choice.value.id === f.id) return
  p2Choice.value = f
  sfx.select()
}

const confirmSelection = () => {
  sfx.heavy()
  emit('select', {
    p1: p1Choice.value,
    p2: p2Choice.value,
    difficulty: difficulty.value
  })
}

const DIFF_LABELS = { easy: 'FÁCIL', medium: 'MEDIO', hard: 'DIFÍCIL' }
const DIFF_COLORS = { easy: '#22c55e', medium: '#eab308', hard: '#ef4444' }
</script>

<template>
  <div class="select-screen">
    <!-- Header pixel art -->
    <div class="px-header">
      <div class="header-scanline"></div>
      <h1 class="game-title">
        <span class="title-line1">★ PURA VIDA ★</span>
        <span class="title-line2">FIGHTERS</span>
      </h1>
      <div class="header-sub">ELIGE TU LUCHADOR</div>
    </div>

    <!-- Main selection area -->
    <div class="select-main">

      <!-- P1 panel -->
      <div class="char-panel p1-panel" :class="{ 'has-choice': p1Choice }" :style="{ '--pc': hoveredP1.palette.body || '#fbbf24' }">
        <div class="panel-tag p1-tag">JUGADOR 1</div>
        <div class="char-display">
          <div class="big-sprite-container">
            <PixelPreview :fighter="hoveredP1" :scale="2.2" :animate="true" />
          </div>
          <div class="char-pixel-name">{{ hoveredP1.name.toUpperCase() }}</div>
          <div class="char-quote" v-if="!hoveredP1.locked">"{{ hoveredP1.quote || '¡Pura Vida!' }}"</div>
          <div class="char-quote locked-txt" v-else>🔒 PERSONAJE BLOQUEADO</div>
        </div>
        
        <div class="char-info-box">
          <div class="char-stats-pro">
            <div class="stat-row">
              <span class="stat-label">VIDA</span>
              <div class="stat-bar-pro"><div class="fill" :style="{ width: (hoveredP1.maxHp/220*100)+'%', background: '#ef4444' }"></div></div>
            </div>
            <div class="stat-row">
              <span class="stat-label">VEL.</span>
              <div class="stat-bar-pro"><div class="fill" :style="{ width: (hoveredP1.speed/365*100)+'%', background: '#3b82f6' }"></div></div>
            </div>
            <div class="stat-row">
              <span class="stat-label">DAÑO</span>
              <div class="stat-bar-pro"><div class="fill" :style="{ width: (hoveredP1.damage/38*100)+'%', background: '#f59e0b' }"></div></div>
            </div>
          </div>
          <div class="char-lore-pro">{{ hoveredP1.lore }}</div>
        </div>
      </div>

      <!-- Center roster -->
      <div class="center-panel">
        <div class="roster-header">PANTALLA DE SELECCIÓN</div>
        
        <!-- Character grid -->
        <div class="roster-grid">
          <div
            v-for="f in FIGHTERS"
            :key="f.id"
            class="roster-card"
            :class="{
              'is-p1': p1Choice.id === f.id,
              'is-p2': p2Choice.id === f.id,
              'is-hover': hoveredP1.id === f.id,
              'is-locked': f.locked
            }"
            @mouseenter="hoveredP1 = f"
            @click="selectP1(f)"
            @contextmenu.prevent="selectP2(f)"
          >
            <div class="card-glow"></div>
            <div class="card-inner">
              <div class="card-sprite" :class="{ 'silhouette': f.locked && p1Choice.id !== f.id && p2Choice.id !== f.id }">
                <PixelPreview :fighter="f" :scale="1" :animate="hoveredP1.id === f.id" />
              </div>
              <div class="card-name">{{ f.name.toUpperCase() }}</div>
            </div>
            
            <div v-if="f.locked" class="lock-overlay">
              <span>🔒</span>
            </div>

            <div class="card-indicators" v-else>
              <div v-if="p1Choice.id === f.id" class="ind p1">1P</div>
              <div v-if="p2Choice.id === f.id" class="ind p2">CPU</div>
            </div>
          </div>
        </div>

        <div class="difficulty-selection">
          <button
            v-for="d in ['easy','medium','hard']"
            :key="d"
            class="diff-pill"
            :class="{ active: difficulty === d }"
            @click="difficulty = d"
          >
            {{ DIFF_LABELS[d] }}
          </button>
        </div>
      </div>

      <!-- P2 panel (CPU) -->
      <div class="char-panel p2-panel" :class="{ 'has-choice': p2Choice }" :style="{ '--pc': p2Choice.palette.body || '#ef4444' }">
        <div class="panel-tag p2-tag">RIVAL CPU</div>
        <div class="char-display">
          <div class="big-sprite-container">
            <PixelPreview :fighter="p2Choice" :scale="2.2" :animate="true" />
          </div>
          <div class="char-pixel-name">{{ p2Choice.name.toUpperCase() }}</div>
        </div>
        
        <div class="char-info-box">
          <div class="char-stats-pro">
            <div class="stat-row">
              <span class="stat-label">VIDA</span>
              <div class="stat-bar-pro"><div class="fill" :style="{ width: (p2Choice.maxHp/220*100)+'%', background: '#ef4444' }"></div></div>
            </div>
            <div class="stat-row">
              <span class="stat-label">VEL.</span>
              <div class="stat-bar-pro"><div class="fill" :style="{ width: (p2Choice.speed/365*100)+'%', background: '#3b82f6' }"></div></div>
            </div>
            <div class="stat-row">
              <span class="stat-label">DAÑO</span>
              <div class="stat-bar-pro"><div class="fill" :style="{ width: (p2Choice.damage/38*100)+'%', background: '#f59e0b' }"></div></div>
            </div>
          </div>
          <div class="char-lore-pro">{{ p2Choice.lore }}</div>
        </div>
      </div>

    </div>

    <!-- Bottom Controls & Action -->
    <div class="select-footer">
      <div class="controls-guide">
        <div class="guide-item"><span>A / D</span> MOVER</div>
        <div class="guide-item"><span>W / ESPACIO</span> SALTAR</div>
        <div class="guide-item"><span>J / K</span> ATAQUE</div>
        <div class="guide-item"><span>L</span> BLOQUEAR</div>
      </div>
      
      <button class="confirm-btn" @click="confirmSelection">¡A PELEAR!</button>
      
      <div class="footer-hint">CLIC IZQUIERDO: P1 | CLIC DERECHO: CPU</div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

.select-screen {
  width: 100%;
  height: 100vh;
  background: #020617;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-family: 'Outfit', sans-serif;
  color: #fff;
  padding: 20px;
  overflow: hidden;
  position: relative;
}

.select-screen::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, transparent 70%);
  pointer-events: none;
}

/* ── HEADER ── */
.px-header {
  text-align: center;
  z-index: 10;
}

.title-line1 {
  font-size: 1.2rem;
  color: #fbbf24;
  letter-spacing: 12px;
  font-weight: 700;
  display: block;
  margin-bottom: 8px;
}

.title-line2 {
  font-size: 3.5rem; /* Reducido de 5rem */
  font-weight: 950;
  letter-spacing: -2px;
  background: linear-gradient(to bottom, #fff 30%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
  line-height: 0.9;
}

/* ── MAIN LAYOUT ── */
.select-main {
  display: flex;
  justify-content: center; /* Centrar paneles lateralmente */
  align-items: center; /* Centrar paneles verticalmente */
  gap: 30px;
  width: 100%;
  max-width: 1400px;
  flex: 1;
  min-height: 0;
  z-index: 10;
  padding: 20px 0;
}

/* ── CHAR PANELS ── */
.char-panel {
  width: 280px; /* Reducido de 320 */
  background: rgba(15, 23, 42, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid var(--pc);
  display: flex;
  flex-direction: column;
  padding: 15px; /* Reducido de 30 */
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.char-panel.has-choice {
  border-color: var(--pc);
}

.panel-tag {
  position: absolute;
  top: -12px;
  left: 20px;
  padding: 4px 12px;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 2px;
  background: #000;
  border: 2px solid var(--pc);
  color: var(--pc);
  z-index: 10;
}

.char-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  min-height: 250px;
}

.big-sprite-container {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
  transition: all 0.3s;
}

.char-pixel-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 950;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 #000;
  margin-bottom: 5px;
  height: 50px;
  display: flex;
  align-items: center;
  text-align: center;
}

.char-quote {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--pc);
  font-style: italic;
  text-align: center;
  margin-bottom: 10px;
  height: 30px;
  display: flex;
  align-items: center;
  animation: quoteFade 0.3s ease-out;
}

.char-quote.locked-txt {
  color: #ef4444;
  font-weight: 900;
  font-style: normal;
  letter-spacing: 2px;
  animation: pulseLocked 1s infinite alternate;
}

@keyframes pulseLocked {
  from { opacity: 0.6; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes quoteFade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.char-info-box {
  background: rgba(0,0,0,0.3);
  padding: 20px;
  border-radius: 4px;
}

.char-stats-pro {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 900;
  color: #64748b;
  width: 40px;
}

.stat-bar-pro {
  flex: 1;
  height: 6px;
  background: #1e293b;
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar-pro .fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.char-lore-pro {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.4;
  font-style: italic;
  text-align: center;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── CENTER PANEL ── */
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.roster-header {
  font-size: 1.2rem;
  letter-spacing: 4px;
  color: #64748b;
  margin-bottom: 30px;
  font-weight: 700;
}

.roster-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 500px; /* Limitando el ancho para que no crezcan infinito en pantalla grande */
  margin-bottom: 10px;
}

.roster-card {
  aspect-ratio: 1 / 1.1; /* Más bajito */
  background: #0f172a;
  border: 2px solid rgba(255,255,255,0.05);
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
}

.roster-card:hover, .roster-card.is-hover {
  transform: translateY(-5px);
  border-color: rgba(255,255,255,0.2);
}

.roster-card.is-p1 { border-color: #22c55e; }
.roster-card.is-p2 { border-color: #ef4444; }

.roster-card.is-locked {
  cursor: not-allowed;
  opacity: 0.8;
  border-color: rgba(255,255,255,0.02);
}

.silhouette {
  filter: brightness(0) contrast(1);
  opacity: 0.4;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(0,0,0,0.4);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.roster-card:hover .card-glow { opacity: 1; }

.card-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.card-sprite {
  transform: scale(0.8);
  transition: transform 0.3s;
}

.roster-card:hover .card-sprite {
  transform: scale(1);
}

.card-name {
  font-size: 0.7rem;
  font-weight: 900;
  color: #64748b;
  margin-top: 10px;
  letter-spacing: 1px;
}

.card-indicators {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
}

.ind {
  font-size: 0.6rem;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 2px;
}

.ind.p1 { background: #22c55e; color: #000; }
.select-footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  z-index: 20;
}

.controls-guide {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.guide-item {
  font-family: monospace;
  font-size: 0.7rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.guide-item span {
  background: #1e293b;
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,0.1);
}

.footer-hint {
  font-size: 0.6rem;
  font-family: monospace;
  color: #475569;
  letter-spacing: 1px;
}
.ind.p2 { background: #ef4444; color: #fff; }

/* ── UI ELEMENTS ── */
.difficulty-selection {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.diff-pill {
  background: #1e293b;
  border: none;
  color: #64748b;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.diff-pill.active {
  background: #fbbf24;
  color: #000;
}

.confirm-btn {
  background: #fbbf24;
  color: #000;
  border: none;
  padding: 12px 40px;
  font-size: 1.2rem;
  font-weight: 950;
  letter-spacing: 4px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
  transition: all 0.2s;
}

.confirm-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 15px 40px rgba(251, 191, 36, 0.4);
}

.confirm-btn:active {
  transform: translateY(2px) scale(0.98);
}
</style>
