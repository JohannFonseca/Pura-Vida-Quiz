<script setup>
/**
 * VerdaderoFalsoView.vue
 * 
 * Este es un juego de "Cierto o Falso" sobre datos curiosos de Costa Rica.
 * Es el más dinámico en cuanto a ritmo, perfecto para aprender conceptos rápidos.
 */

import { ref, computed, onUnmounted } from 'vue'
// Importamos las preguntas desde el archivo de datos
import { questions } from '../../data/verdadero-falso.js'

// --- ESTADO DEL JUEGO ---
// inicio | jugando | validando | resultados
const gameState = ref('inicio') 
const currentQIndex = ref(0)
const maxTime = 10 // Solo 10 segundos, ¡hay que ser rápido!
const timeLeft = ref(maxTime)
let timerInterval = null

// --- TRACKING DEL JUGADOR ---
const userScore = ref(0)
const correctCount = ref(0)
const choiceMade = ref(null) // { boolChoice, timeout, isCorrect }
const logErrores = ref([]) // Guardamos las preguntas fallidas para repasarlas al final

// 'currentQuestion' nos da la pregunta actual basada en el índice
const currentQuestion = computed(() => questions[currentQIndex.value])

// Colores de la barra del timer para dar sentido de urgencia
const barColor = computed(() => {
  if (timeLeft.value > 5) return '#22d3ee' // Cyan (Tranqui)
  if (timeLeft.value > 2) return '#eab308' // Amarillo (Ojo)
  return '#ef4444' // Rojo (¡Corra!)
})

/**
 * Arranca el juego y limpia todo.
 */
const startGame = () => {
  gameState.value = 'jugando'
  currentQIndex.value = 0
  userScore.value = 0
  correctCount.value = 0
  choiceMade.value = null
  logErrores.value = []
  startTimer()
}

/**
 * Reloj de cuenta regresiva.
 */
const startTimer = () => {
  timeLeft.value = maxTime
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      handleTimeout()
    }
  }, 1000)
}

/**
 * Efecto de vibración si el navegador lo permite.
 */
const triggerVibration = () => {
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100])
  }
}

/**
 * Si el usuario no responde a tiempo.
 */
const handleTimeout = () => {
  clearInterval(timerInterval)
  choiceMade.value = { timeout: true, isCorrect: false }
  triggerVibration()
  
  // Guardamos el error
  logErrores.value.push(currentQuestion.value)
  
  gameState.value = 'validando'
  setTimeout(() => nextQuestion(), 4500)
}

/**
 * Cuando el usuario presiona Verdadero (true) o Falso (false).
 */
const selectAnswer = (decision) => {
  if (gameState.value !== 'jugando') return
  clearInterval(timerInterval)
  
  const esCorrecta = (decision === currentQuestion.value.esVerdadero)
  choiceMade.value = { timeout: false, boolChoice: decision, isCorrect: esCorrecta }
  
  if (esCorrecta) {
    correctCount.value += 1
    // Más puntos si respondes volando
    userScore.value += 100 + (timeLeft.value * 20) 
  } else {
    triggerVibration()
    logErrores.value.push(currentQuestion.value)
  }
  
  gameState.value = 'validando'
  setTimeout(() => nextQuestion(), 4500)
}

/**
 * Pasa a la siguiente pregunta.
 */
const nextQuestion = () => {
  choiceMade.value = null
  if (currentQIndex.value < questions.length - 1) {
    currentQIndex.value += 1
    gameState.value = 'jugando'
    startTimer()
  } else {
    gameState.value = 'resultados'
  }
}

// --- CÁLCULOS DE RESULTADOS ---
const percentage = computed(() => {
  return Math.round((correctCount.value / questions.length) * 100)
})

const feedbackData = computed(() => {
  const p = percentage.value
  if (p <= 40) return { title: 'Te falta calle tica 😅', desc: '¡Estás creyendo toda la publicidad engañosa del folleto, amigo!' }
  if (p <= 70) return { title: 'Sabés lo básico 👀', desc: 'Sobrevivís engañando a los que vienen de afuera, pero a un tico real no.' }
  return { title: 'Nivel experto 🇨🇷🔥', desc: '¡Felicidades, te sabés nuestra historia al dedillo!' }
})

const shareToWhatsapp = () => {
  const p = percentage.value
  const msg = `Saqué ${p}% en Verdadero o falso sobre Mitos 🇨🇷 ¿Cuánto sacás vos? Retame en: ${window.location.origin}/jugar/verdadero-falso`
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank')
}

// Limpiar el interval siempre
onUnmounted(() => clearInterval(timerInterval))
</script>

<template>
  <div class="view-container">
    
    <!-- FONDO QUE CAMBIA DE COLOR SEGÚN SI FALLÁS O ACERTÁS -->
    <div :class="['game-mode-bg', { 
                  'has-bg': gameState === 'inicio',
                  'flash-correct': gameState === 'validando' && choiceMade?.isCorrect,
                  'flash-error': gameState === 'validando' && !choiceMade?.isCorrect 
                }]"
         :style="{ backgroundImage: gameState === 'inicio' ? `url('/imagenes/verdadero_falso_bg.png')` : 'none' }">
    </div>

    <div class="game-wrapper" :class="{ 'shake-animation': gameState === 'validando' && !choiceMade?.isCorrect }">
      
      <!-- PANTALLA: INICIO -->
      <div v-if="gameState === 'inicio'" class="inicio-screen">
        <h1 class="main-title">Verdadero o Falso <br>✅❌</h1>
        <p class="subtitle">¿Qué tan bien conocés Costa Rica en serio?</p>
        
        <div class="details-box">
          <p>⚡ Reacción tipo relámpago (10s)</p>
          <p>🤯 Derriba mitos internacionales</p>
          <p>💔 Cuidado, ¡si la fallas vibra!</p>
        </div>
        
        <button @click="startGame" class="btn-start">Empezar Choque</button>
        <button @click="$router.push('/jugar')" class="btn-secondary">Regresar</button>
      </div>

      <!-- PANTALLA: JUEGO / VALIDACIÓN -->
      <div v-if="gameState === 'jugando' || gameState === 'validando'" class="play-screen">
        
        <div class="top-nav">
          <div class="badge-score">Score: {{ Math.round(userScore) }}</div>
          <div class="badge-count">{{ currentQIndex + 1 }} de {{ questions.length }}</div>
        </div>

        <div class="timer-container" v-if="gameState === 'jugando'">
          <div class="timer-bar" :style="{ width: `${(timeLeft/maxTime)*100}%`, backgroundColor: barColor }"></div>
        </div>
        <div class="timer-container-ghost" v-else></div>

        <!-- IMAGEN DEL MITO -->
        <div class="feature-image">
          <img :src="currentQuestion.imagen" alt="Imagen del reto" />
        </div>

        <div class="question-zone">
          <h2 class="hypothesis">{{ currentQuestion.mito }}</h2>
        </div>

        <!-- BOTONES DE VERDADERO / FALSO -->
        <div class="bin-grid" v-if="gameState === 'jugando'">
          <button class="btn-true" @click="selectAnswer(true)">
            ✅ VERDADERO
          </button>
          <button class="btn-false" @click="selectAnswer(false)">
            ❌ FALSO
          </button>
        </div>

        <!-- FEEDBACK INSTANTÁNEO -->
        <div v-if="gameState === 'validando'" class="instant-feedback">
          <h2 v-if="choiceMade?.timeout" class="fb-timeout">¡DEMASIADO LENTO! ⏰</h2>
          <h2 v-else-if="choiceMade?.isCorrect" class="fb-good">¡CORRECTO! 🎯</h2>
          <h2 v-else class="fb-bad">¡INCORRECTO! 💥</h2>

          <p class="fb-expl"><strong>{{ currentQuestion.esVerdadero ? 'El dato es Real:' : 'Era puro Mito:' }}</strong> {{ currentQuestion.explicacion }}</p>
        </div>

      </div>

      <!-- PANTALLA: RESULTADOS -->
      <div v-if="gameState === 'resultados'" class="result-screen">
        <h3>Tu Nivel:</h3>
        
        <div class="final-score">
          <span>{{ percentage }}%</span>
        </div>
        
        <h2 class="result-title">{{ feedbackData.title }}</h2>
        <p class="result-desc">{{ feedbackData.desc }}</p>

        <div class="share-box">
          <button @click="shareToWhatsapp" class="btn-share-whatsapp">
            📲 Compartir nivel en WhatsApp
          </button>
        </div>

        <!-- Listado de lo que fallaste para que aprendas -->
        <div class="errors-list" v-if="logErrores.length > 0">
          <h4 class="err-title">Mitos donde tropezaste ({{logErrores.length}}):</h4>
          <div v-for="err in logErrores" :key="err.id" class="err-card">
            <p><strong>{{ err.mito }}</strong></p>
            <p class="err-reason">📍 <em>{{ err.explicacion }}</em></p>
          </div>
        </div>
        
        <div class="nav-bottom">
          <button @click="startGame" class="btn-start">La Revancha</button>
          <button @click="$router.push('/jugar')" class="btn-sub">Ir a otro Juego</button>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.view-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* FONDOS DINÁMICOS ANIMADOS */
.game-mode-bg {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-size: cover; background-position: center;
  z-index: -1; transition: background-color 0.15s ease-out;
  background-color: #f8fafc;
}
.game-mode-bg.has-bg::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
}
.game-mode-bg.flash-correct { background-color: #dcfce7; /* flash verde suave */ }
.game-mode-bg.flash-error { background-color: #fee2e2; /* flash rojo suave */ }

/* WRAPPER Y SHAKE EFFECT */
.game-wrapper {
  position: relative; z-index: 10; max-width: 600px; width: 100%;
  padding: 1rem; margin-top: 2rem; animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popUp {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.shake-animation {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
  40%, 60% { transform: translate3d(8px, 0, 0); }
}

/* PANTALLAS */
.inicio-screen, .play-screen, .result-screen {
  background: white; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.08); padding: 2.5rem 2rem; text-align: center;
}
.play-screen { padding: 2rem; display: flex; flex-direction: column; }

/* INICIO Y GENERAL */
.main-title { font-size: 2.8rem; color: #0f172a; font-weight: 900; margin-bottom: 0.5rem; line-height: 1.1;}
.subtitle { font-size: 1.1rem; color: #64748b; margin-bottom: 2rem; }
.details-box { background: #f1f5f9; padding: 1.5rem; border-radius: 12px; margin: 0 auto 2rem; max-width: 250px; text-align: left; font-weight: 700; color: #334155; }
.details-box p { margin: 0.5rem 0;}

.btn-start { 
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; padding: 1.2rem 2rem; font-size: 1.2rem; border-radius: 50px; font-weight: 900; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(37,99,235,0.3); width: 100%; max-width: 300px; display: block; margin: 0 auto 1rem;
}
.btn-start:hover { transform: scale(1.05); }
.btn-secondary {
  background: white; color: #64748b; border: 2px solid #e2e8f0; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.2s; width: 100%; max-width: 300px;
}
.btn-secondary:hover { background: #f8fafc; color: #0f172a; }

/* PLAY INTERFACE */
.top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800;}
.badge-score { color: #f59e0b; font-size: 1.2rem;}
.badge-count { color: #94a3b8; }
.timer-container, .timer-container-ghost { height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden; margin-bottom: 1.5rem; }
.timer-bar { height: 100%; transition: width 1s linear, background-color 0.2s; }

.feature-image { width: 100%; height: 220px; border-radius: 16px; overflow: hidden; margin-bottom: 1.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.05);}
.feature-image img { width: 100%; height: 100%; object-fit: cover;}

.question-zone { min-height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;}
.hypothesis { font-size: 1.4rem; color: #1e293b; font-weight: 800; line-height: 1.35; margin: 0;}

.bin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;}
@media (max-width:400px){ .bin-grid { grid-template-columns: 1fr; } }
.btn-true, .btn-false { border: none; padding: 1.5rem; border-radius: 16px; font-size: 1.3rem; font-weight: 900; color: white; cursor: pointer; transition: 0.15s; }
.btn-true { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); box-shadow: 0 4px 15px rgba(34,197,94,0.3);}
.btn-false { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); box-shadow: 0 4px 15px rgba(239,68,68,0.3);}
.btn-true:hover { transform: scale(1.03) translateY(-2px); }
.btn-false:hover { transform: scale(1.03) translateY(-2px); }

/* FEEDBACK (Replaces buttons on validation) */
.instant-feedback { 
  background: white; border: 2px solid #e2e8f0; padding: 1.5rem; border-radius: 16px; animation: popUp 0.2s ease-out; 
}
.fb-timeout { color: #f59e0b; font-size: 1.8rem; margin-bottom: 0.5rem;}
.fb-good { color: #22c55e; font-size: 1.8rem; margin-bottom: 0.5rem; }
.fb-bad { color: #ef4444; font-size: 1.8rem; margin-bottom: 0.5rem; }
.fb-expl { color: #334155; font-size: 1.1rem; line-height: 1.5; }

/* RESULTS */
.final-score { 
  width: 140px; height: 140px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin: 2rem auto; border: 8px solid #3b82f6; box-shadow: 0 5px 25px rgba(59,130,246,0.2); 
}
.final-score span { font-size: 3rem; font-weight: 900; color: #1d4ed8; }
.result-title { font-size: 1.6rem; color: #0f172a; margin-bottom: 0.5rem; font-weight: 900; }
.result-desc { font-size: 1.1rem; color: #64748b; margin-bottom: 2rem; }

.btn-share-whatsapp { background: #25D366; color: white; border: none; padding: 1.2rem 2rem; font-size: 1.15rem; border-radius: 50px; font-weight: 800; cursor: pointer; transition: 0.2s; width: 100%; display: block; margin: 0 auto; margin-bottom: 2rem;}
.btn-share-whatsapp:hover { background: #128C7E; transform: scale(1.02); }

.errors-list { text-align: left; background: #f8fafc; padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem; border: 1px solid #e2e8f0;}
.err-title { color: #ef4444; margin-bottom: 1rem; font-size: 1.1rem;}
.err-card { margin-bottom: 1rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 1rem; }
.err-card:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0;}
.err-reason { color: #64748b; font-size: 0.95rem; margin-top: 0.2rem;}

.nav-bottom { display: flex; flex-direction: column; gap: 0.8rem; }
</style>
