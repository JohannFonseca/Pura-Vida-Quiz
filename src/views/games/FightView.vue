<script setup>
/**
 * VISTA PRINCIPAL DEL JUEGO DE PELEA
 * Aquí manejamos el "Game Loop" y la integración con el Canvas.
 * Como estudiantes de la UCR, queremos que esto sea modular y escalable.
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FIGHTERS } from '../../data/fighters.js'
import { CW, CH, makeState, update, render, sfx } from '../../composables/useFightGame.js'
import FighterPreview from '../../components/games/FighterPreview.vue'

const router = useRouter()
const canvasRef = ref(null)

// ── MANEJO DE FASES Y ESTADO ──
// 'select' -> Pantalla de personajes
// 'fight'  -> El juego corriendo
// 'result' -> El ganador
const phase     = ref('select') 
const p1Choice  = ref(FIGHTERS[0])
const p2Choice  = ref(FIGHTERS[2])
const winner    = ref(null)
const winnerName = ref('')

// Estados de "Hover" para que la previsualización cambie al pasar el mouse.
const p1Hover = ref(FIGHTERS[0])
const p2Hover = ref(FIGHTERS[2])

// ── SISTEMA DE ENTRADA (Teclado) ──
let gs = null, keys = {}, animId = null, lastTime = null

function onKeyDown(e) {
  keys[e.key] = true
  // Evitamos que el navegador haga scroll al presionar espacio o flechas.
  if ([' ','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault()
}
function onKeyUp(e) { keys[e.key] = false }

// ── EL GAME LOOP (CORAZÓN DEL JUEGO) ──
// Esta función se ejecuta hasta 60 veces por segundo (requestAnimationFrame).
function loop(ts) {
  if (phase.value !== 'fight') return
  if (lastTime === null) lastTime = ts
  // Calculamos Delta Time (dt) para que el juego corra igual en pantallas rápidas y lentas.
  const dt = Math.min((ts - lastTime) / 1000, 0.05)
  lastTime = ts

  // 1. Update: Calcula la física y lógica.
  update(gs, dt, keys, (w) => { 
    winner.value = w; 
    winnerName.value = w === 'p1' ? gs.p1.name : gs.p2.name; 
    phase.value = 'result' 
  })

  // 2. Render: Dibuja todo en el canvas.
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) render(ctx, gs)

  // Recursividad para el siguiente frame.
  animId = requestAnimationFrame(loop)
}

function startFight() {
  if (!p1Choice.value || !p2Choice.value) return
  keys = {}; lastTime = null
  // Creamos el estado inicial del motor de juego.
  gs = makeState(p1Choice.value, p2Choice.value)
  phase.value = 'fight'
  animId = requestAnimationFrame(loop)
}

function stopLoop() { if (animId) { cancelAnimationFrame(animId); animId = null } }

function restart() { 
  stopLoop()
  phase.value = 'select'
  winner.value = null 
}

function selectP1(f) {
  if (p2Choice.value?.id === f.id) return
  p1Choice.value = f; p1Hover.value = f
}

function selectP2(f) {
  if (p1Choice.value?.id === f.id) return
  p2Choice.value = f; p2Hover.value = f
}

// Lifecycle hooks para manejar los eventos globales.
onMounted(() => { window.addEventListener('keydown', onKeyDown); window.addEventListener('keyup', onKeyUp) })
onUnmounted(() => { stopLoop(); window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp) })
</script>

<template>
  <div class="fight-container">
    
    <!-- ── SELECCIÓN DE PERSONAJES (THE GAME) ── -->
    <Transition name="slide-up">
      <div v-if="phase === 'select'" class="game-menu">
        <div class="menu-header">
          <button class="back-pill" @click="router.push('/minijuegos')">⬅ Salir</button>
          <h1 class="game-logo">Pura Vida <span class="accent">Fighters</span></h1>
          <div class="header-spacer"></div>
        </div>

        <div class="selection-grid">
          
          <!-- PLAYER 1 PREVIEW -->
          <div class="char-preview p1-preview" :style="{ '--char-color': p1Hover.palette.body }">
            <div class="preview-glow"></div>
            <div class="preview-content">
              <span class="player-tag">P1</span>
              <div class="big-preview-wrap">
                <FighterPreview :fighter="p1Hover" :size="200" />
              </div>
              <h2 class="char-name">{{ p1Hover.name }}</h2>
              <p class="char-lore">"{{ p1Hover.lore }}"</p>
              <div class="char-stats">
                <div class="stat-row"><span>HP</span><div class="bar"><div class="fill" :style="{width: (p1Hover.maxHp/220*100)+'%'}"></div></div></div>
                <div class="stat-row"><span>SPD</span><div class="bar"><div class="fill spd" :style="{width: (p1Hover.speed/365*100)+'%'}"></div></div></div>
                <div class="stat-row"><span>POW</span><div class="bar"><div class="fill pow" :style="{width: (p1Hover.damage/38*100)+'%'}"></div></div></div>
              </div>
            </div>
          </div>

          <!-- SELECTION ROSTER -->
          <div class="roster-container">
            <h3 class="roster-title">Elige tu destino</h3>
            <div class="roster-grid">
              <div 
                v-for="f in FIGHTERS" 
                :key="f.id"
                class="roster-item"
                :class="{ 
                  'p1-selected': p1Choice?.id === f.id,
                  'p2-selected': p2Choice?.id === f.id,
                  'disabled': (p1Choice?.id === f.id && p2Choice?.id === f.id)
                }"
                @mouseenter="p1Hover = f"
                @click="selectP1(f)"
                @contextmenu.prevent="selectP2(f)"
              >
                <div class="item-inner">
                  <FighterPreview :fighter="f" :size="80" :animate="false" />
                  <div class="selection-indicators">
                    <span v-if="p1Choice?.id === f.id" class="p-indicator p1">P1</span>
                    <span v-if="p2Choice?.id === f.id" class="p-indicator p2">CPU</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button class="fight-start-btn" :disabled="!p1Choice || !p2Choice" @click="startFight">
              ¡PELEAR!
            </button>
            <p class="control-help">Click Izq: P1 | Click Der: CPU</p>
          </div>

          <!-- PLAYER 2 PREVIEW -->
          <div class="char-preview p2-preview" :style="{ '--char-color': p2Hover.palette.body }">
            <div class="preview-glow"></div>
            <div class="preview-content">
              <span class="player-tag cpu">CPU</span>
              <div class="big-preview-wrap">
                <FighterPreview :fighter="p2Hover" :size="200" />
              </div>
              <h2 class="char-name">{{ p2Hover.name }}</h2>
              <p class="char-lore">"{{ p2Hover.lore }}"</p>
              <div class="char-stats">
                <div class="stat-row"><span>HP</span><div class="bar"><div class="fill" :style="{width: (p2Hover.maxHp/220*100)+'%'}"></div></div></div>
                <div class="stat-row"><span>SPD</span><div class="bar"><div class="fill spd" :style="{width: (p2Hover.speed/365*100)+'%'}"></div></div></div>
                <div class="stat-row"><span>POW</span><div class="bar"><div class="fill pow" :style="{width: (p2Hover.damage/38*100)+'%'}"></div></div></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ── FIGHT SCREEN ── -->
    <Transition name="fade">
      <div v-if="phase === 'fight' || phase === 'result'" class="canvas-stage">
        
        <!-- UI OVERLAYS -->
        <div v-if="phase === 'result'" class="game-over">
          <div class="victory-card">
            <h1 class="victory-title">¡VICTORIA!</h1>
            <div class="winner-display">
              <span class="winner-emoji">{{ winner === 'p1' ? gs.p1.emoji : gs.p2.emoji }}</span>
              <h2 class="winner-name">{{ winnerName }}</h2>
            </div>
            <div class="victory-actions">
              <button class="v-btn primary" @click="restart">REVANCHA</button>
              <button class="v-btn secondary" @click="router.push('/minijuegos')">SALIR</button>
            </div>
          </div>
        </div>

        <canvas ref="canvasRef" :width="CW" :height="CH" class="battle-canvas" />
        
        <!-- MOBILE HUD -->
        <div class="mobile-controls" v-if="phase === 'fight'">
          <div class="d-pad">
            <button class="ctrl-btn" @pointerdown="keys['a']=true" @pointerup="keys['a']=false">◀</button>
            <button class="ctrl-btn" @pointerdown="keys['d']=true" @pointerup="keys['d']=false">▶</button>
          </div>
          <div class="action-pad">
            <button class="ctrl-btn jump" @pointerdown="keys['w']=true" @pointerup="keys['w']=false">SALTAR</button>
            <button class="ctrl-btn punch" @pointerdown="keys['j']=true" @pointerup="keys['j']=false">GOLPE</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.fight-container {
  width: 100%;
  height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

/* ── SELECTION MENU ── */
.game-menu {
  width: 100%;
  max-width: 1200px;
  background: #0f172a;
  border-radius: 24px;
  padding: 2rem;
  border: 4px solid #1e293b;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 0 8px rgba(34,197,94,0.1);
  color: white;
  overflow: hidden;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.game-logo {
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -1px;
  margin: 0;
}
.game-logo .accent { color: #22c55e; text-shadow: 0 0 20px rgba(34,197,94,0.5); }

.back-pill {
  background: #1e293b;
  border: none;
  color: #94a3b8;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.selection-grid {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 2rem;
  align-items: center;
}

/* Character Previews */
.char-preview {
  background: #1e293b;
  border-radius: 20px;
  padding: 2rem;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--char-color);
  transition: all 0.3s ease;
}

.preview-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--char-color) 0%, transparent 60%);
  opacity: 0.15;
  transform: translate(-50%, -50%);
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.1); }
}

.preview-content {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.player-tag {
  background: #22c55e;
  color: white;
  padding: 0.2rem 1rem;
  border-radius: 4px;
  font-weight: 900;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}
.player-tag.cpu { background: #ef4444; }

.big-preview-wrap {
  margin-bottom: 1rem;
  filter: drop-shadow(0 15px 30px rgba(0,0,0,0.6));
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.big-emoji {
  font-size: 6rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
}

.char-name {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0 0 0.5rem;
  color: white;
}

.char-lore {
  font-size: 0.9rem;
  color: #94a3b8;
  font-style: italic;
  margin-bottom: 2rem;
}

.char-stats {
  margin-top: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.stat-row span {
  width: 40px;
  font-size: 0.7rem;
  font-weight: 900;
  color: #64748b;
}
.bar {
  flex: 1;
  height: 6px;
  background: #0f172a;
  border-radius: 999px;
  overflow: hidden;
}
.fill { height: 100%; background: #ef4444; transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.fill.spd { background: #3b82f6; }
.fill.pow { background: #fbbf24; }

/* Roster */
.roster-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.roster-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.roster-grid {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.roster-item {
  width: 100px;
  height: 100px;
  background: #1e293b;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  border: 3px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.roster-item:hover {
  transform: scale(1.1);
  background: #334155;
  border-color: rgba(255,255,255,0.2);
}
.roster-item.p1-selected { border-color: #22c55e; box-shadow: 0 0 20px rgba(34,197,94,0.3); }
.roster-item.p2-selected { border-color: #ef4444; box-shadow: 0 0 20px rgba(239,68,68,0.3); }

.item-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-emoji { font-size: 3rem; }

.selection-indicators {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 4px;
}
.p-indicator {
  font-size: 0.6rem;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
}
.p-indicator.p1 { background: #22c55e; }
.p-indicator.p2 { background: #ef4444; }

.fight-start-btn {
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  border: none;
  color: white;
  padding: 1.2rem 3rem;
  font-size: 1.5rem;
  font-weight: 900;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(22,163,74,0.3);
  transition: all 0.2s;
}
.fight-start-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 15px 30px rgba(22,163,74,0.4);
}
.fight-start-btn:active { transform: translateY(0) scale(1); }
.fight-start-btn:disabled { opacity: 0.3; cursor: not-allowed; grayscale: 1; }

.control-help {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #475569;
}

/* ── BATTLE STAGE ── */
.canvas-stage {
  position: relative;
  background: #000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.8);
}

.battle-canvas {
  display: block;
  max-width: 100%;
  height: auto;
}

/* VICTORY SCREEN */
.game-over {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.victory-card {
  text-align: center;
  animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes zoomIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.victory-title {
  font-size: 4rem;
  font-weight: 950;
  color: #fbbf24;
  margin: 0;
  text-shadow: 0 0 30px rgba(251,191,36,0.5);
}

.winner-display {
  margin: 2rem 0;
}
.winner-emoji { font-size: 8rem; display: block; margin-bottom: 1rem; }
.winner-name { font-size: 2.5rem; font-weight: 900; color: white; }

.victory-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.v-btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.v-btn.primary { background: #22c55e; color: white; }
.v-btn.secondary { background: #334155; color: #94a3b8; }
.v-btn:hover { transform: scale(1.1); }

/* MOBILE CONTROLS */
.mobile-controls {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  pointer-events: none;
}
.d-pad, .action-pad { display: flex; gap: 20px; pointer-events: auto; }

.ctrl-btn {
  width: 70px;
  height: 70px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: white;
  font-weight: 900;
  cursor: pointer;
}
.ctrl-btn:active { background: rgba(255,255,255,0.3); transform: scale(0.9); }
.ctrl-btn.punch { background: rgba(239,68,68,0.3); border-color: #ef4444; }
.ctrl-btn.jump { background: rgba(34,197,94,0.3); border-color: #22c55e; }

/* TRANSITIONS */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s ease; }
.slide-up-enter-from { transform: translateY(100px); opacity: 0; }
.slide-up-leave-to { transform: translateY(-100px); opacity: 0; }

@media (max-width: 1000px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }
  .char-preview { display: none; }
  .fight-container { height: auto; padding: 2rem 0; }
}
</style>
