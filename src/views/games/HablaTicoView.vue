<script setup>
/**
 * HablaTicoView.vue
 * 
 * Este juego enseña el "slang" o jerga costarricense.
 * Es un ejemplo de cómo usar un Log de Errores para dar retroalimentación al final.
 */

import { ref, computed, onUnmounted } from 'vue'
// Importamos las preguntas (frases) desde la base de datos local
import { questions } from '../../data/habla-tico.js'
import ScoreRegistration from '../../components/ScoreRegistration.vue'

// --- ESTADO GLOBAL ---
const gameState = ref('inicio') 
const currentQIndex = ref(0)
const maxTime = 12
const timeLeft = ref(maxTime)
let timerInterval = null

// --- TRACKING DEL JUGADOR ---
const respuestasCorrectas = ref(0)
const selectedChoice = ref(null)
const errorLog = ref([]) // Aquí guardamos qué falló el usuario para enseñárselo al final
const userScore = ref(0)

const currentQuestion = computed(() => questions[currentQIndex.value])

// El color de la barra cambia según el tiempo restante
const barColor = computed(() => {
  if (timeLeft.value > 6) return '#10b981' // Verde tropical
  if (timeLeft.value > 3) return '#f59e0b' // Naranja amigable
  return '#f43f5e' // Rojo peligro
})

/**
 * Resetea el juego y arranca la primera pregunta.
 */
const startGame = () => {
  gameState.value = 'jugando'
  currentQIndex.value = 0
  respuestasCorrectas.value = 0
  userScore.value = 0
  errorLog.value = []
  selectedChoice.value = null
  startTimer()
}

/**
 * Lógica del reloj de cuenta regresiva.
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
 * Qué pasa si el usuario se queda "mamando" (se le acaba el tiempo).
 */
const handleTimeout = () => {
  clearInterval(timerInterval)
  selectedChoice.value = { timeout: true, option: null }
  
  // Como se agotó el tiempo, cuenta como error. Lo metemos al Log para que lo estudie luego.
  errorLog.value.push({
    expresion: currentQuestion.value.expresion,
    elegido: "Se agotó el tiempo 🐢",
    correcto: currentQuestion.value.respuesta,
    significado: currentQuestion.value.significado,
    ejemplo: currentQuestion.value.ejemplo
  })
  
  gameState.value = 'validando'
  // 3 segundos de pausa para ver la respuesta correcta
  setTimeout(() => nextQuestion(), 3000)
}

/**
 * Se activa cuando el usuario toca una de las opciones de respuesta.
 */
const selectOption = (opt) => {
  if (gameState.value !== 'jugando') return
  clearInterval(timerInterval)
  
  const esCorrecta = (opt === currentQuestion.value.respuesta)
  selectedChoice.value = { timeout: false, option: opt, esCorrecta }
  
  if (esCorrecta) {
    respuestasCorrectas.value += 1
    // Más puntos si respondes rápido
    userScore.value += 1000 + (timeLeft.value * 50) 
  } else {
    // Si falla, guardamos todo el detalle de la frase
    errorLog.value.push({
      expresion: currentQuestion.value.expresion,
      elegido: opt,
      correcto: currentQuestion.value.respuesta,
      significado: currentQuestion.value.significado,
      ejemplo: currentQuestion.value.ejemplo
    })
  }
  
  gameState.value = 'validando'
  setTimeout(() => nextQuestion(), 3000)
}

/**
 * Avanza a la siguiente pregunta o muestra los resultados.
 */
const nextQuestion = () => {
  selectedChoice.value = null
  if (currentQIndex.value < questions.length - 1) {
    currentQIndex.value += 1
    gameState.value = 'jugando'
    startTimer()
  } else {
    gameState.value = 'resultados'
  }
}

// --- CÁLCULOS DE RESULTADOS ---
const scorePercentage = computed(() => {
  return Math.round((respuestasCorrectas.value / questions.length) * 100)
})

const feedbackData = computed(() => {
  const p = scorePercentage.value
  if (p <= 40) return { title: 'Gringo perdido 😅', desc: '¡Se nota que usás calcetines con sandalias en la playa! Te falta calle tica.' }
  if (p <= 70) return { title: 'Ya vas agarrando el toque 👀', desc: 'Sobrante, ya podrías irte a tomar un yodo sin pasar tanta vergüenza.' }
  return { title: 'Sos tico honorario 🇨🇷🔥', desc: '¡Al chile! Podrías escribir el nuevo diccionario de la RAE tica.' }
})

const shareToWhatsapp = () => {
  const p = scorePercentage.value
  const msg = `Saqué ${p}% en "Habla como tico" 🇨🇷😂 ¿Vos qué tanto entendés? Superá mi reto jugando aquí: ${window.location.origin}/quizzes/habla-tico`
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank')
}

// Importante: Limpiar el timer al destruir el componente
onUnmounted(() => clearInterval(timerInterval))
</script>

<template>
  <div class="view-container">
    
    <!-- FONDO DINÁMICO -->
    <div :class="['colorful-bg', { 'has-bg': gameState === 'inicio' }]"
         :style="{ backgroundImage: gameState === 'inicio' ? `url('/imagenes/habla_como_tico.png')` : 'none' }">
    </div>

    <div class="game-wrapper">
      
      <!-- PANTALLA: INICIO -->
      <div v-if="gameState === 'inicio'" class="inicio-screen">
        <h1 class="main-title">🗣️ Habla como tico</h1>
        <p class="subtitle">¿De verdad entendés el español de Costa Rica, o solo decís "pura vida" y sonreís callado?</p>
        
        <div class="details-box">
          <p>⏳ 12 Segundos de adrenalina</p>
          <p>📝 8 Frases ultra ticas</p>
          <p>📚 Retroalimentación al final</p>
        </div>
        
        <button @click="startGame" class="btn-primary">Empezar Exámen</button>
        <button @click="$router.push('/quizzes')" class="btn-secondary">Volver Atrás</button>
      </div>

      <!-- PANTALLA: JUEGO / VALIDACIÓN -->
      <div v-if="gameState === 'jugando' || gameState === 'validando'" class="play-screen">
        
        <div class="top-nav">
          <div class="tipo-badge">Reto: {{ currentQuestion.tipo }}</div>
          <div class="counter-badge">Frase {{ currentQIndex + 1 }} / {{ questions.length }}</div>
        </div>

        <div class="timer-container">
          <div class="timer-bar" :style="{ width: `${(timeLeft/maxTime)*100}%`, backgroundColor: barColor }"></div>
        </div>

        <!-- Área de imagen -->
        <div class="image-area">
          <img :src="currentQuestion.image || currentQuestion.imagen" alt="Expresion Tica" />
        </div>

        <!-- Pregunta contextual -->
        <p v-if="currentQuestion.preguntaVisual" class="context-desc">{{ currentQuestion.preguntaVisual }}</p>
        <h2 class="question-text">¿Qué significa «{{ currentQuestion.expresion }}»?</h2>

        <!-- Opciones de respuesta -->
        <div class="options-grid">
          <button v-for="(opt, idx) in currentQuestion.opciones" :key="idx"
                  class="opt-btn"
                  :class="{
                    'opt-correct': gameState === 'validando' && opt === currentQuestion.respuesta,
                    'opt-incorrect': gameState === 'validando' && selectedChoice?.option === opt && !selectedChoice?.esCorrecta,
                    'disabled-opt': gameState === 'validando'
                  }"
                  :disabled="gameState === 'validando'"
                  @click="selectOption(opt)">
            {{ opt }}
          </button>
        </div>

      </div>

      <!-- PANTALLA: RESULTADOS -->
      <div v-if="gameState === 'resultados'" class="result-screen">
        <h3>Tu Nivel Oficial:</h3>
        
        <div class="score-circle-tico">
          <span>{{ scorePercentage }}%</span>
        </div>
        
        <h2 class="result-title">{{ feedbackData.title }}</h2>
        <p class="result-desc">{{ feedbackData.desc }}</p>

        <div class="share-box">
          <button @click="shareToWhatsapp" class="btn-whatsapp">
            📲 Compartir en WhatsApp
          </button>
        </div>

        <!-- REGISTRO DE PUNTUACIÓN -->
        <ScoreRegistration :score="userScore" gameName="Habla como Tico" />

        <!-- REVISIÓN DE ERRORES (Ideal para aprender) -->
        <div class="feedback-zone" v-if="errorLog.length > 0">
          <h4 class="feedback-title">📖 Correcciones para cuando andés en la calle:</h4>
          
          <div v-for="(err, idx) in errorLog" :key="idx" class="error-item">
            <h5 class="err-expresion">«{{ err.expresion }}»</h5>
            <p class="err-elegido">Elegiste: <del>{{ err.elegido }}</del></p>
            <p class="err-real">Lo correcto es: <strong>{{ err.correcto }}</strong></p>
            <hr class="err-divider" />
            <p class="err-significado">{{ err.significado }}</p>
            <p class="err-ejemplo"><em>Ej: {{ err.ejemplo }}</em></p>
          </div>
        </div>
        
        <div class="nav-bottom">
          <button @click="startGame" class="btn-primary">Intentar de nuevo</button>
          <button @click="$router.push('/quizzes')" class="btn-secondary">Regresar al Menú</button>
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

.colorful-bg {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(135deg, #fce7f3 0%, #e0e7ff 100%);
  background-size: cover;
  background-position: center;
  z-index: -1; 
  transition: opacity 0.3s;
}

.colorful-bg.has-bg::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.game-wrapper {
  position: relative;
  z-index: 10;
  max-width: 650px;
  width: 100%;
  padding: 1rem;
  margin-top: 2rem;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.inicio-screen, .result-screen, .play-screen {
  background: white; border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.06); padding: 2rem;
}
.inicio-screen { text-align: center; padding: 4rem 2rem; }

.main-title { color: #f43f5e; font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; }
.subtitle { font-size: 1.2rem; color: #475569; }

.details-box { background: #f8fafc; border: 2px dashed #cbd5e1; padding: 1.5rem; border-radius: 12px; margin: 2rem auto; text-align: left; font-weight: bold; color: #334155; max-width: 300px; }
.details-box p { margin: 0.5rem 0; }

.btn-primary { background: #f43f5e; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(244,63,94,0.3); margin: 0.5rem; }
.btn-primary:hover { background: #e11d48; transform: translateY(-2px); }
.btn-secondary { background: white; color: #334155; border: 2px solid #e2e8f0; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 50px; font-weight: bold; cursor: pointer; transition: 0.2s; margin: 0.5rem; }
.btn-secondary:hover { background: #f1f5f9; }
.btn-whatsapp { background: #25D366; color: white; border: none; padding: 1.2rem 2rem; font-size: 1.15rem; border-radius: 50px; font-weight: 800; cursor: pointer; transition: 0.2s; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
.btn-whatsapp:hover { background: #128C7E; transform: scale(1.02); }

.top-nav { display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: bold; }
.tipo-badge { color: #8b5cf6; background: #ede9fe; padding: 0.5rem 1rem; border-radius: 8px;}
.counter-badge { color: #64748b; padding: 0.5rem; }

.timer-container { height: 10px; background: #e2e8f0; border-radius: 6px; overflow: hidden; margin-bottom: 1.5rem; }
.timer-bar { height: 100%; transition: width 1s linear, background-color 0.3s; }

.image-area { width: 100%; height: 250px; border-radius: 12px; overflow: hidden; margin-bottom: 1rem; border: 1px solid #e2e8f0;}
.image-area img { width: 100%; height: 100%; object-fit: cover; }

.context-desc { font-weight: bold; color: #475569; text-align: center; margin-bottom: 0.5rem; font-size: 1.1rem; }
.question-text { text-align: center; margin-bottom: 2rem; font-size: 1.5rem; color: #0f172a; font-weight: 800; }

.options-grid { display: flex; flex-direction: column; gap: 0.8rem; }
.opt-btn { background: white; border: 2px solid #e2e8f0; padding: 1.2rem; border-radius: 12px; font-weight: 600; font-size: 1.1rem; cursor: pointer; transition: 0.2s; color: #334155; text-align: left; }
.opt-btn:not(.disabled-opt):hover { background: #f8fafc; border-color: #cbd5e1; transform: translateX(5px); }
.opt-btn.opt-correct { background: #f0fdf4; border-color: #22c55e; color: #16a34a; }
.opt-btn.opt-incorrect { background: #fef2f2; border-color: #ef4444; color: #dc2626; }
.opt-btn.disabled-opt { opacity: 0.9; cursor: default; }

.score-circle-tico { width: 150px; height: 150px; border-radius: 50%; background: #fff1f2; display: flex; align-items: center; justify-content: center; margin: 1rem auto 2rem; border: 8px solid #f43f5e; box-shadow: 0 8px 25px rgba(244,63,94,0.2); }
.score-circle-tico span { font-size: 3.5rem; font-weight: 900; color: #be123c; }

.result-title { font-size: 1.8rem; color: #0f172a; font-weight: 900;}
.result-desc { font-size: 1.1rem; color: #64748b; margin-bottom: 1.5rem; }

.feedback-zone { margin-top: 3rem; background: #f8fafc; padding: 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; text-align: left; }
.feedback-title { font-size: 1.2rem; color: #334155; font-weight: 800; margin-bottom: 1.5rem;}
.error-item { background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
.err-expresion { font-size: 1.3rem; color: #e11d48; margin-bottom: 0.5rem; font-weight: 900; }
.err-elegido { color: #ef4444; font-size: 0.95rem; margin-bottom: 0.2rem;}
.err-real { color: #10b981; font-size: 1.1rem; margin-bottom: 1rem; }
.err-divider { border: 0; height: 1px; background: #e2e8f0; margin: 1rem 0; }
.err-significado { color: #334155; font-weight: 600; margin-bottom: 0.5rem;}
.err-ejemplo { color: #64748b; font-size: 0.95rem; }

.nav-bottom { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.5rem;}
</style>
