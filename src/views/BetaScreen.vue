<script setup>
/**
 * BetaScreen.vue
 *
 * Pantalla experimental de "Modo Beta".
 * Incluye:
 *  - Botón que huye del mouse ("Atrápame")
 *  - Mini reto de velocidad de reacción
 *  - Sistema de puntuación reactivo (scoreBeta)
 *  - Récord guardado en localStorage
 *  - Feedback visual y sonidos opcionales
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// ─── Estado del botón "Atrápame" ──────────────────────────────────────────────
const catchPos = ref({ x: 50, y: 50 }); // posición en porcentaje dentro del contenedor
const catchFeedback = ref(''); // '' | 'caught'

// ─── Estado del reto de velocidad ────────────────────────────────────────────
const reactionState = ref('idle'); // 'idle' | 'waiting' | 'ready' | 'done'
const reactionStartTime = ref(0);
const reactionResult = ref(null); // ms
const reactionFeedback = ref(''); // '' | 'good' | 'bad'
let reactionTimeout = null;

// ─── Puntuación ───────────────────────────────────────────────────────────────
const scoreBeta = ref(0);

// ─── Récord (localStorage) ────────────────────────────────────────────────────
const bestRecord = ref(null);

onMounted(() => {
  const saved = localStorage.getItem('betaBestRecord');
  if (saved) bestRecord.value = parseInt(saved, 10);
});

// ─── Helpers de sonido ────────────────────────────────────────────────────────
/**
 * Genera un sonido oscilado usando la Web Audio API.
 * @param {'success'|'error'|'move'} type
 */
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'move') {
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (_) {
    // El navegador puede bloquear AudioContext sin interacción previa; ignoramos.
  }
}

// ─── Lógica del botón "Atrápame" ─────────────────────────────────────────────
/** Mueve el botón a una posición aleatoria dentro del contenedor (en %) */
function moveButton() {
  // Márgenes para que no se salga del contenedor
  catchPos.value = {
    x: Math.random() * 75 + 5,  // 5% – 80%
    y: Math.random() * 70 + 5,  // 5% – 75%
  };
  playSound('move');
}

/** Se dispara al pasar el mouse: el botón "escapa" */
function onCatchHover() {
  moveButton();
}

/** Se dispara cuando el usuario logra hacer clic (muy difícil) */
function onCatchClick() {
  catchFeedback.value = 'caught';
  scoreBeta.value += 10;
  playSound('success');
  setTimeout(() => {
    catchFeedback.value = '';
    moveButton();
  }, 800);
}

// ─── Lógica del reto de velocidad ────────────────────────────────────────────
/** Inicia el reto: espera un tiempo aleatorio y luego activa el botón */
function startReaction() {
  reactionState.value = 'waiting';
  reactionResult.value = null;
  reactionFeedback.value = '';

  const delay = 1500 + Math.random() * 2500; // entre 1.5s y 4s
  reactionTimeout = setTimeout(() => {
    reactionState.value = 'ready';
    reactionStartTime.value = Date.now();
  }, delay);
}

/** El usuario hizo clic cuando el botón estaba listo */
function registerReaction() {
  if (reactionState.value !== 'ready') {
    // Clic demasiado temprano
    reactionState.value = 'idle';
    reactionFeedback.value = 'bad';
    clearTimeout(reactionTimeout);
    playSound('error');
    return;
  }
  const elapsed = Date.now() - reactionStartTime.value;
  reactionResult.value = elapsed;
  reactionState.value = 'done';

  // Determinar feedback
  if (elapsed < 300) {
    reactionFeedback.value = 'good';
    scoreBeta.value += 15;
    playSound('success');
  } else {
    reactionFeedback.value = 'ok';
    scoreBeta.value += 5;
    playSound('success');
  }

  // Guardar récord
  if (bestRecord.value === null || elapsed < bestRecord.value) {
    bestRecord.value = elapsed;
    localStorage.setItem('betaBestRecord', elapsed);
  }
}

/** Mensaje de calidad del tiempo de reacción */
function reactionLabel(ms) {
  if (ms < 200) return '⚡ ¡Increíble!';
  if (ms < 300) return '🔥 ¡Muy rápido!';
  if (ms < 500) return '👍 Bien hecho';
  return '🐌 Un poco lento…';
}

/** Volver a la pantalla de inicio */
function goBack() {
  router.push('/');
}
</script>

<template>
  <div class="beta-page">

    <!-- ═══════════════════════════════════════ HEADER ══════════════════════════ -->
    <header class="beta-header">
      <button class="back-btn" @click="goBack" id="beta-back-btn">
        ⬅ Volver
      </button>
      <div class="header-text">
        <h1 class="beta-title">🚧 Modo Beta</h1>
        <p class="beta-subtitle">Funciones en prueba, podés experimentar libremente</p>
      </div>
      <!-- Badge de puntuación siempre visible -->
      <div class="score-badge" id="beta-score-badge">
        ⭐ {{ scoreBeta }} pts
      </div>
    </header>

    <!-- ═══════════════════════════════════════ GRID DE SECCIONES ══════════════ -->
    <div class="beta-grid">

      <!-- ── Sección 1: Botón "Atrápame" ──────────────────────────────────────── -->
      <section class="beta-card catch-card">
        <h2 class="card-title">🎯 ¡Atrápame si puedes!</h2>
        <p class="card-desc">Pasa el mouse por encima… si podés.</p>

        <!-- Contenedor de posición absoluta -->
        <div class="catch-arena" id="catch-arena">
          <button
            class="catch-btn"
            :class="{ caught: catchFeedback === 'caught' }"
            :style="{ left: catchPos.x + '%', top: catchPos.y + '%' }"
            @mouseover="onCatchHover"
            @click="onCatchClick"
            id="catch-btn"
          >
            {{ catchFeedback === 'caught' ? '😵 ¡Me atrapaste!' : '😈 Atrápame' }}
          </button>

          <!-- Feedback verde cuando lo atrapan -->
          <transition name="pop">
            <div v-if="catchFeedback === 'caught'" class="catch-toast">
              +10 pts 🎉
            </div>
          </transition>
        </div>

        <p class="catch-hint">
          Puntos acumulados por atrapar: <strong>{{ scoreBeta }}</strong>
        </p>
      </section>

      <!-- ── Sección 2: Reto de velocidad ─────────────────────────────────────── -->
      <section class="beta-card reaction-card">
        <h2 class="card-title">⚡ Reto de velocidad</h2>
        <p class="card-desc">Hacé clic en cuanto el botón cambie a verde.</p>

        <div class="reaction-area">

          <!-- Estado: idle -->
          <button
            v-if="reactionState === 'idle'"
            class="reaction-btn idle-btn"
            @click="startReaction"
            id="reaction-start-btn"
          >
            🚀 Empezar reto
          </button>

          <!-- Estado: esperando (no hagas clic todavía) -->
          <button
            v-else-if="reactionState === 'waiting'"
            class="reaction-btn waiting-btn"
            @click="registerReaction"
            id="reaction-waiting-btn"
          >
            ⏳ Espera…
          </button>

          <!-- Estado: ¡Ahora! -->
          <button
            v-else-if="reactionState === 'ready'"
            class="reaction-btn ready-btn"
            @click="registerReaction"
            id="reaction-ready-btn"
          >
            ✅ ¡AHORA!
          </button>

          <!-- Estado: resultado -->
          <div v-else-if="reactionState === 'done'" class="result-block">
            <p class="reaction-ms" :class="reactionFeedback">
              Tu tiempo: <strong>{{ reactionResult }} ms</strong>
            </p>
            <p class="reaction-label">{{ reactionLabel(reactionResult) }}</p>
            <button class="reaction-btn idle-btn" @click="startReaction" id="reaction-retry-btn">
              🔁 Intentar de nuevo
            </button>
          </div>

          <!-- Feedback de clic prematuro -->
          <transition name="pop">
            <p v-if="reactionFeedback === 'bad'" class="early-msg">
              😅 ¡Muy temprano! Esperá la señal verde.
            </p>
          </transition>
        </div>

        <!-- Récord personal -->
        <div class="record-block" id="beta-record-block">
          <span class="record-label">🏆 Mejor récord:</span>
          <span class="record-value">
            {{ bestRecord !== null ? bestRecord + ' ms' : '—' }}
          </span>
        </div>
      </section>

      <!-- ── Sección 3: Panel de puntuación ────────────────────────────────────── -->
      <section class="beta-card score-card">
        <h2 class="card-title">🏅 Tu puntuación Beta</h2>
        <p class="card-desc">Cada interacción suma puntos. ¡Explorá todo!</p>

        <div class="score-display" id="score-display">
          <span class="score-number">{{ scoreBeta }}</span>
          <span class="score-unit">puntos</span>
        </div>

        <ul class="score-breakdown">
          <li>🎯 Atrapar el botón fugitivo <span>+10 pts</span></li>
          <li>⚡ Reacción bajo 300 ms <span>+15 pts</span></li>
          <li>👍 Cualquier reacción válida <span>+5 pts</span></li>
        </ul>

        <button
          class="reset-btn"
          @click="scoreBeta = 0"
          id="score-reset-btn"
        >
          🗑 Reiniciar puntuación
        </button>
      </section>

    </div><!-- /beta-grid -->
  </div><!-- /beta-page -->
</template>

<style scoped>
/* ── Variables internas (heredan del tema global) ── */
.beta-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
  width: 100%;
  animation: fadeInUp 0.4s ease both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════ HEADER ════════════════════════════ */
.beta-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.back-btn {
  background: #ffffff;
  border: 2px solid var(--border-color);
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.55rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.back-btn:hover {
  background: var(--accent-green-light);
  border-color: var(--accent-green);
  transform: translateX(-3px);
}

.header-text {
  flex: 1;
}

.beta-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 0.2rem;
}

.beta-subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

.score-badge {
  background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%);
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  padding: 0.5rem 1.2rem;
  border-radius: 9999px;
  box-shadow: 0 4px 14px rgba(34,197,94,0.35);
  white-space: nowrap;
  transition: transform 0.2s ease;
}
.score-badge:hover { transform: scale(1.05); }

/* ═══════════════════════════ GRID ═════════════════════════════ */
.beta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* ═══════════════════════════ CARDS ════════════════════════════ */
.beta-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.beta-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(34,197,94,0.12);
}

.card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

/* ═══════════════════════════ CATCH SECTION ═════════════════════ */
.catch-arena {
  position: relative;
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px dashed var(--accent-green-light);
  border-radius: 16px;
  overflow: hidden;
}

.catch-btn {
  position: absolute;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: #fff;
  border: none;
  padding: 0.6rem 1.3rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(249,115,22,0.4);
  transition: background 0.2s ease, transform 0.15s ease;
  white-space: nowrap;
  user-select: none;
}

.catch-btn.caught {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 6px 18px rgba(34,197,94,0.4);
  transform: translate(-50%, -50%) scale(1.15);
}

.catch-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #22c55e;
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  padding: 0.5rem 1.5rem;
  border-radius: 12px;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(34,197,94,0.4);
}

.catch-hint {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-align: center;
}

/* ═══════════════════════════ REACTION SECTION ══════════════════ */
.reaction-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-height: 120px;
  justify-content: center;
}

.reaction-btn {
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: 800;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
}

.idle-btn {
  background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(34,197,94,0.35);
}
.idle-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(34,197,94,0.4); }

.waiting-btn {
  background: #f59e0b;
  color: #fff;
  box-shadow: 0 4px 14px rgba(245,158,11,0.35);
  animation: pulse-wait 1s ease infinite;
}

@keyframes pulse-wait {
  0%, 100% { box-shadow: 0 4px 14px rgba(245,158,11,0.35); }
  50%       { box-shadow: 0 4px 22px rgba(245,158,11,0.6); }
}

.ready-btn {
  background: #22c55e;
  color: #fff;
  box-shadow: 0 4px 18px rgba(34,197,94,0.5);
  animation: pulse-ready 0.5s ease infinite alternate;
  transform: scale(1.05);
}

@keyframes pulse-ready {
  from { transform: scale(1.05); }
  to   { transform: scale(1.12); }
}

.result-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.reaction-ms {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
}
.reaction-ms.good strong { color: #16a34a; }
.reaction-ms.ok strong  { color: #f59e0b; }

.reaction-label {
  font-size: 1.1rem;
  color: var(--text-muted);
  font-weight: 600;
  margin: 0;
}

.early-msg {
  font-size: 0.95rem;
  color: #ef4444;
  font-weight: 600;
  text-align: center;
}

.record-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid var(--accent-green-light);
  border-radius: 12px;
  padding: 0.75rem 1.2rem;
}

.record-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}

.record-value {
  font-size: 1rem;
  font-weight: 800;
  color: var(--accent-green-dark);
}

/* ═══════════════════════════ SCORE SECTION ═════════════════════ */
.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-green-dark) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(34,197,94,0.3);
}

.score-number {
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  transition: all 0.3s ease;
}

.score-unit {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  margin-top: 0.25rem;
}

.score-breakdown {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.score-breakdown li {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--border-color);
}

.score-breakdown li:last-child { border-bottom: none; }

.score-breakdown li span {
  font-weight: 700;
  color: var(--accent-green-dark);
}

.reset-btn {
  background: #fff;
  border: 2px solid #fca5a5;
  color: #ef4444;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}
.reset-btn:hover {
  background: #fef2f2;
  border-color: #ef4444;
  transform: scale(1.03);
}

/* ═══════════════════════════ TRANSICIONES ══════════════════════ */
.pop-enter-active  { animation: pop-in 0.3s ease; }
.pop-leave-active  { animation: pop-out 0.2s ease forwards; }

@keyframes pop-in  { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
@keyframes pop-out { to   { opacity:0; transform:scale(0.7); } }

/* ═══════════════════════════ RESPONSIVE ════════════════════════ */
@media (max-width: 768px) {
  .beta-title { font-size: 1.6rem; }
  .beta-header { flex-direction: column; align-items: flex-start; }
  .score-badge { align-self: flex-start; }
}
</style>
