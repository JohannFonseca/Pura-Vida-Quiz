<script setup>
/**
 * DondeEstoyView.vue
 * 
 * Este juego muestra fotos de lugares de Costa Rica y el usuario debe adivinar cuál es.
 * Es un gran ejemplo de cómo manejar estados (inicio, jugando, resultados) y temporizadores.
 */

import { ref, computed, onUnmounted } from 'vue'
// Importamos las preguntas desde nuestro nuevo archivo de datos
import { questions } from '../../data/donde-estoy.js'
import ScoreRegistration from '../../components/ScoreRegistration.vue'

// --- ESTADO GLOBAL DEL JUEGO ---
// 'gameState' controla qué pantalla ve el usuario: 'inicio', 'jugando', 'validando' o 'resultados'.
const gameState = ref('inicio') 
// 'currentQIndex' es el índice de la pregunta actual (empieza en 0).
const currentQIndex = ref(0)
const maxTime = 12
const timeLeft = ref(maxTime)
let timerInterval = null

// --- VARIABLES DE PUNTUACIÓN ---
const userScore = ref(0)
const maxPossibleScore = ref(0) // 1000 puntos base por pregunta
const respuestasCorrectas = ref(0)
const selectedChoice = ref(null)

// --- PISTAS (COMODINES) ---
// Estos son booleanos que indican si el usuario ya usó la pista en esta partida.
const pistaProvincia = ref(false)
const pista5050 = ref(false)
const pistaLetra = ref(false)

// Estado temporal para las pistas en la pregunta actual
const omittedOptions = ref([]) // Opciones que el 50/50 quitó
const showProv = ref(false)    // Si se está mostrando la provincia
const showLetra = ref(false)   // Si se está mostrando la primera letra

// 'currentQuestion' es una propiedad computada que nos da el objeto de la pregunta actual.
// Se actualiza solita cuando 'currentQIndex' cambia.
const currentQuestion = computed(() => questions[currentQIndex.value])

// El color de la barra de tiempo cambia según cuántos segundos quedan.
const barColor = computed(() => {
  if (timeLeft.value > 6) return '#3b82f6' // Azul
  if (timeLeft.value > 3) return '#f59e0b' // Amarillo
  return '#ef4444' // Rojo
})

/**
 * Inicia la partida reseteando todos los valores.
 */
const startGame = () => {
  gameState.value = 'jugando'
  currentQIndex.value = 0
  userScore.value = 0
  maxPossibleScore.value = questions.length * 1000
  respuestasCorrectas.value = 0
  
  // Reiniciamos los comodines para que pueda usarlos de nuevo
  pistaProvincia.value = false
  pista5050.value = false
  pistaLetra.value = false
  
  resetQuestionLevelState()
  startTimer()
}

/**
 * Limpia el estado de pistas que son específicas de UNA pregunta.
 */
const resetQuestionLevelState = () => {
  omittedOptions.value = []
  showProv.value = false
  showLetra.value = false
  selectedChoice.value = null
}

/**
 * Arranca el reloj del juego.
 */
const startTimer = () => {
  timeLeft.value = maxTime
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      handleTimeout() // ¡Se acabó el tiempo!
    }
  }, 1000)
}

/**
 * Maneja el caso cuando el usuario no responde a tiempo.
 */
const handleTimeout = () => {
  clearInterval(timerInterval)
  selectedChoice.value = { timeout: true, option: null }
  gameState.value = 'validando'
  // Esperamos 4 segundos para que el usuario lea la respuesta correcta antes de seguir.
  setTimeout(() => nextQuestion(), 4000)
}

// --- LÓGICA DE PISTAS ---
// Usar pistas penaliza el puntaje total, para hacerlo un reto.

const usarPistaProvincia = () => {
  if (pistaProvincia.value || gameState.value !== 'jugando') return
  pistaProvincia.value = true
  showProv.value = true
  userScore.value -= 100 
}

const usarPista5050 = () => {
  if (pista5050.value || gameState.value !== 'jugando') return
  pista5050.value = true
  
  const correct = currentQuestion.value.respuesta
  const falsas = currentQuestion.value.opciones.filter(o => o !== correct)
  // Desordenamos las falsas y quitamos dos
  falsas.sort(() => 0.5 - Math.random())
  omittedOptions.value = [falsas[0], falsas[1]]
  userScore.value -= 300
}

const usarPistaLetra = () => {
  if (pistaLetra.value || gameState.value !== 'jugando') return
  pistaLetra.value = true
  showLetra.value = true
  userScore.value -= 100
}

const isOptionDisabled = (opt) => {
  return omittedOptions.value.includes(opt) || gameState.value === 'validando'
}

/**
 * Se ejecuta cuando el usuario toca una opción.
 */
const selectOption = (opt) => {
  if (gameState.value !== 'jugando') return
  clearInterval(timerInterval) // Detenemos el tiempo
  
  const esCorrecta = (opt === currentQuestion.value.respuesta)
  selectedChoice.value = { timeout: false, option: opt, esCorrecta }
  
  if (esCorrecta) {
    respuestasCorrectas.value += 1
    // Puntos extra por ser rápido:
    const puntosBase = 1000
    const delayPenalty = (maxTime - timeLeft.value) * 50 
    const puntosGanados = Math.max(0, puntosBase - delayPenalty)
    userScore.value += puntosGanados
  }
  
  gameState.value = 'validando'
  setTimeout(() => nextQuestion(), 4000)
}

/**
 * Pasa a la siguiente pregunta o termina el juego.
 */
const nextQuestion = () => {
  resetQuestionLevelState()
  if (currentQIndex.value < questions.length - 1) {
    currentQIndex.value += 1
    gameState.value = 'jugando'
    startTimer()
  } else {
    gameState.value = 'resultados'
  }
}

// --- CÁLCULOS FINALES ---
const scorePercentage = computed(() => {
  const val = Math.round((userScore.value / maxPossibleScore.value) * 100)
  return val < 0 ? 0 : val
})

const feedbackData = computed(() => {
  const p = scorePercentage.value
  if (p <= 40) return { msg: 'Turista perdido 😅', desc: '¡Ocupás Waze hasta para ir a la pulpería!' }
  if (p <= 70) return { msg: 'Conocés algo 👀', desc: 'Tenés pasaporte tico, pero todavía te falta calle.' }
  return { msg: 'Nivel tico experto 🇨🇷🔥', desc: 'Seguro sos chofer de bus, ¡te lo sabés todo!' }
})

const shareToWhatsapp = () => {
  const p = scorePercentage.value
  const msg = `Saqué ${p}% como experto en el juego ¿Dónde estoy? 🇨🇷🔥 ¡Intenta superarme entrando acá: ${window.location.origin}/jugar/donde-estoy !`
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank')
}

// Limpieza: es importante quitar el intervalo si el usuario se sale de la página
onUnmounted(() => clearInterval(timerInterval))

</script>

<template>
  <div class="view-container">
    
    <!-- FONDO DINÁMICO -->
    <div :class="['game-mode-bg', { 'has-bg': gameState === 'inicio', 'bg-ocean-wave': gameState !== 'inicio' }]" 
         :style="{ backgroundImage: gameState === 'inicio' ? `url('/imagenes/donde-estoy/donde_q1_arenal.png')` : 'none' }">
    </div>

    <div class="game-wrapper">
      
      <!-- PANTALLA: INICIO -->
      <div v-if="gameState === 'inicio'" class="inicio-screen">
        <h1>¿Dónde estoy? 📍</h1>
        <p>Poné a prueba cuánto conocés de Costa Rica escondida.</p>
        <div class="details-box">
          <p>⏳ Tiempo bajo presión</p>
          <p>💡 3 Comodines globales por partida</p>
        </div>
        <button @click="startGame" class="btn-primary">Jugar Ahora</button>
        <button @click="$router.push('/jugar')" class="btn-secondary">Volver Atrás</button>
      </div>

      <!-- PANTALLA: JUEGO / VALIDACIÓN -->
      <div v-if="gameState === 'jugando' || gameState === 'validando'" class="play-screen">
        
        <div class="top-nav">
          <div class="points-badge">Score: {{ Math.round(userScore) }} px</div>
          <div class="counter-badge">{{ currentQIndex + 1 }} / {{ questions.length }}</div>
        </div>

        <!-- Barra de progreso del tiempo -->
        <div class="timer-container">
          <div class="timer-bar" :style="{ width: `${(timeLeft/maxTime)*100}%`, backgroundColor: barColor }"></div>
        </div>

        <!-- Barra de Pistas -->
        <div class="hints-toolbar">
          <button @click="usarPistaProvincia" :class="{ 'used': pistaProvincia }" :disabled="pistaProvincia" title="-100 pts">
            🗺️ Provincia
          </button>
          <button @click="usarPista5050" :class="{ 'used': pista5050 }" :disabled="pista5050" title="-300 pts">
            ✂️ 50/50
          </button>
          <button @click="usarPistaLetra" :class="{ 'used': pistaLetra }" :disabled="pistaLetra" title="-100 pts">
            🔤 1ra Letra
          </button>
        </div>

        <!-- Pistas Activas -->
        <div class="active-hints-display" v-if="showProv || showLetra">
          <span v-if="showProv" class="hint-label">📍 Provincia: {{ currentQuestion.provincia }}</span>
          <span v-if="showLetra" class="hint-label">🔤 Empieza con: "{{ currentQuestion.respuesta.charAt(0) }}"</span>
        </div>

        <div class="image-area">
          <img :src="currentQuestion.imagen" alt="Lugar" />
        </div>

        <h2 class="question-text">¿Dónde es este lugar?</h2>

        <div class="options-grid">
          <button v-for="(opt, idx) in currentQuestion.opciones" :key="idx"
                  class="opt-btn"
                  :class="{
                    'hidden-opt': omittedOptions.includes(opt),
                    'opt-correct': gameState === 'validando' && opt === currentQuestion.respuesta,
                    'opt-incorrect': gameState === 'validando' && selectedChoice?.option === opt && !selectedChoice?.esCorrecta,
                    'disabled-opt': gameState === 'validando'
                  }"
                  :disabled="isOptionDisabled(opt)"
                  @click="selectOption(opt)">
            {{ opt }}
          </button>
        </div>

        <!-- Tarjeta de Feedback cuando el usuario responde -->
        <div v-if="gameState === 'validando'" class="feedback-card" :class="selectedChoice?.esCorrecta ? 'good' : 'bad'">
          <h3>{{ selectedChoice?.esCorrecta ? '¡Correctísimo! ✅' : (selectedChoice?.timeout ? '¡Tiempo Agotado! 🐢' : '¡Nop! ❌') }}</h3>
          <p class="answer-revealed">Era: <strong>{{ currentQuestion.respuesta }}</strong></p>
          <p class="trivia">{{ currentQuestion.curiosidad }}</p>
        </div>

      </div>

      <!-- PANTALLA: RESULTADOS -->
      <div v-if="gameState === 'resultados'" class="result-screen">
        <h1>Resultado Final</h1>
        
        <div class="score-circle-donde">
          <span>{{ scorePercentage }}%</span>
        </div>
        
        <h2 class="result-title">{{ feedbackData.msg }}</h2>
        <p class="result-desc">{{ feedbackData.desc }}</p>
        
        <div class="stats-row">
          <div class="stat">
            <b>{{ respuestasCorrectas }}</b>
            <span>Aciertos</span>
          </div>
          <div class="stat">
            <b>{{ Math.round(userScore) }}</b>
            <span>Puntos Netos</span>
          </div>
        </div>

        <div class="share-box">
          <button @click="shareToWhatsapp" class="btn-whatsapp">
            📲 Compartir en WhatsApp
          </button>
        </div>

        <!-- REGISTRO DE PUNTUACIÓN -->
        <ScoreRegistration :score="userScore" gameName="¿Donde Estoy?" />

        <div class="nav-bottom">
          <button @click="startGame" class="btn-primary">Intentar de nuevo</button>
          <button @click="$router.push('/jugar')" class="btn-secondary">Ir a Juegos</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Estilos locales para la vista */
.view-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.game-mode-bg {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-size: cover;
  background-position: center;
  z-index: -1; 
  transition: opacity 0.3s;
}

.game-mode-bg.has-bg::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.45);
}

.game-wrapper {
  position: relative;
  z-index: 10;
  max-width: 650px;
  width: 100%;
  padding: 1rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pantallas */
.inicio-screen, .result-screen {
  background: white; padding: 3.5rem 2rem; border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1); margin-top: 2rem; text-align: center;
}

.play-screen {
  background: white; padding: 2rem; border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.08); margin-top: 1rem;
}

h1 { color: #1e293b; font-size: 2.5rem; margin-bottom: 1rem; font-weight: 800; }
.details-box { background: #f1f5f9; padding: 1.5rem; border-radius: 12px; margin: 2rem auto; max-width: 280px; text-align: left; font-weight: bold; color: #475569;}

/* Botones */
.btn-primary { background: #2563eb; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(37,99,235,0.3); margin: 0.5rem; }
.btn-primary:hover { background: #1d4ed8; transform: translateY(-2px); }
.btn-secondary { background: white; color: #334155; border: 2px solid #e2e8f0; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.2s; margin: 0.5rem; }
.btn-secondary:hover { background: #f8fafc; }
.btn-whatsapp { background: #25D366; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.2s; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn-whatsapp:hover { background: #128C7E; transform: scale(1.02); }

.top-nav { display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: 800; }
.points-badge { color: #2563eb; background: #eff6ff; padding: 0.5rem 1rem; border-radius: 8px;}
.counter-badge { color: #64748b; }
.timer-container { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; }
.timer-bar { height: 100%; transition: width 1s linear, background-color 0.3s; }

/* Pistas */
.hints-toolbar { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.hints-toolbar button { flex: 1; padding: 0.5rem; font-size: 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; background: white; cursor: pointer; font-weight: bold; color: #475569; transition: 0.2s; }
.hints-toolbar button:hover:not(.used) { background: #f1f5f9; border-color: #94a3b8; }
.hints-toolbar button.used { background: #f8fafc; color: #cbd5e1; cursor: not-allowed; text-decoration: line-through; border-color: #f1f5f9;}

.active-hints-display { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
.hint-label { background: #fffbeb; color: #b45309; padding: 0.5rem; border-radius: 8px; font-size: 0.9rem; font-weight: bold; border-left: 4px solid #f59e0b; }

.image-area { width: 100%; height: 280px; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; }
.image-area img { width: 100%; height: 100%; object-fit: cover; }

.question-text { text-align: center; margin-bottom: 1.5rem; font-size: 1.4rem; color: #0f172a; font-weight: 800;}

.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 500px) { .options-grid { grid-template-columns: 1fr; } }
.opt-btn { background: white; border: 2px solid #e2e8f0; padding: 1rem; border-radius: 12px; font-weight: 600; font-size: 1.05rem; cursor: pointer; transition: 0.2s; color: #334155; }
.opt-btn:not(.disabled-opt):not(.hidden-opt):hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05);}
.opt-btn.hidden-opt { visibility: hidden; pointer-events: none; }
.opt-btn.opt-correct { background: #f0fdf4; border-color: #22c55e; color: #16a34a; }
.opt-btn.opt-incorrect { background: #fef2f2; border-color: #ef4444; color: #dc2626; }
.opt-btn.disabled-opt { cursor: default; }

.feedback-card { margin-top: 1.5rem; padding: 1.5rem; border-radius: 12px; animation: fadeIn 0.3s; }
.feedback-card.good { background: #f0fdf4; border-left: 5px solid #22c55e; }
.feedback-card.bad { background: #fef2f2; border-left: 5px solid #ef4444; }
.answer-revealed { font-size: 1.1rem; margin: 0.5rem 0; color: #334155; }
.trivia { font-size: 0.95rem; color: #64748b; font-style: italic; }

.score-circle-donde { width: 160px; height: 160px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; border: 8px solid #3b82f6; box-shadow: 0 8px 25px rgba(59,130,246,0.2); }
.score-circle-donde span { font-size: 3.5rem; font-weight: 900; color: #1e3a8a; }
.result-title { font-size: 1.8rem; color: #0f172a; margin-bottom: 0.5rem; }
.result-desc { font-size: 1.1rem; color: #64748b; margin-bottom: 2rem; }
.stats-row { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; }
.stat { display: flex; flex-direction: column; background: #f8fafc; padding: 1rem; border-radius: 12px; width: 120px; }
.stat b { font-size: 1.5rem; color: #0f172a; }
.stat span { font-size: 0.85rem; color: #64748b; text-transform: uppercase; font-weight: bold; margin-top: 0.2rem;}
.share-box { margin-bottom: 2rem; padding: 0 2rem; }
</style>
