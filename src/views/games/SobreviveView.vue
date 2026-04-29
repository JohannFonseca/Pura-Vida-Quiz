<script setup>
/**
 * SobreviveView.vue
 * 
 * Este juego pone al usuario en situaciones extremas de la naturaleza tica.
 * Usamos una lógica de "explicación" después de cada respuesta para que sea educativo.
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
// Importamos las situaciones de supervivencia
import { questions } from '../../data/sobrevive.js'
import ScoreRegistration from '../../components/ScoreRegistration.vue'

// --- ESTADO GLOBAL ---
// inicio | jugando | validando | resultados
const gameState = ref('inicio') 
const currentQIndex = ref(0)
const score = ref(0)

// --- TIMER ---
const timeLeft = ref(15)
const maxTime = 15
let timerInterval = null

// --- INTERACCIÓN ---
const selectedChoice = ref(null)

const currentQuestion = computed(() => questions[currentQIndex.value])

// El color de la barra cambia segun la urgencia (Rojo si queda poco tiempo)
const barColor = computed(() => {
  if (timeLeft.value > 8) return '#22c55e' // Verde
  if (timeLeft.value > 4) return '#eab308' // Amarillo
  return '#ef4444' // Rojo
})

/**
 * Inicia la partida y resetea contadores.
 */
const startGame = () => {
  gameState.value = 'jugando'
  currentQIndex.value = 0
  score.value = 0
  startTimer()
}

/**
 * Maneja la cuenta regresiva.
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
 * Si se acaba el tiempo, marcamos que no hubo elección y validamos.
 */
const handleTimeout = () => {
  clearInterval(timerInterval)
  selectedChoice.value = { timeout: true, correcta: false }
  gameState.value = 'validando'
  // Pausa de 4 segundos para que lean la explicación legal/científica
  setTimeout(() => nextQuestion(), 4000)
}

/**
 * Se activa al elegir una de las 3 opciones.
 */
const selectOption = (opt) => {
  if (gameState.value !== 'jugando') return
  clearInterval(timerInterval)
  selectedChoice.value = opt
  
  if (opt.correcta) {
    score.value += 1
  }
  
  gameState.value = 'validando'
  setTimeout(() => nextQuestion(), 4000)
}

/**
 * Avanza o termina.
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

// --- CÁLCULOS FINALES ---
const percentage = computed(() => {
  return Math.round((score.value / questions.length) * 100)
})

const feedbackData = computed(() => {
  const p = percentage.value
  if (p <= 40) return { emoji: '💀', msg: 'No sobrevivís ni 1 día', desc: 'Te comió un puma o te perdiste por no saber.' }
  if (p <= 70) return { emoji: '😅', msg: 'Sobrevivís… pero rascando', desc: 'Faltan tácticas, pero tuviste buenos reflejos de ciudad.' }
  return { emoji: '🔥', msg: 'Sos nivel guía de selva', desc: '¡Felicidades! Serías excelente guía en la montaña.' }
})

// Siempre limpiar el timer para no gastar memoria
onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<template>
  <div class="view-container">
    <!-- Fondo decorativo -->
    <div :class="['game-mode-bg', { 'has-bg': gameState === 'inicio' }]" 
         :style="{ backgroundImage: gameState === 'inicio' ? `url('/imagenes/sobrevive_costa_rica.png')` : 'none' }">
    </div>
    
    <!-- Efecto visual de lluvia opcional -->
    <div class="rain-overlay"></div>
    
    <div class="sobrevive-wrapper">

      <!-- PANTALLA: INICIO -->
      <div v-if="gameState === 'inicio'" class="inicio-screen">
        <h1>Sobrevive en Costa Rica 🌴</h1>
        <p>Entra en la selva, toma decisiones rápidas y demuestra que eres capaz de sobrevivir al entorno más crudo y vivo de Costa Rica.</p>
        <div class="rules">
          <p>🕒 15 segundos por turno</p>
          <p>🐾 8 situaciones críticas</p>
        </div>
        <button @click="startGame" class="btn-primary">Empezar a Vivir</button>
        <button @click="$router.push('/quizzes')" class="btn-secondary">Volver Atrás</button>
      </div>

      <!-- PANTALLA: JUEGO / VALIDACIÓN -->
      <div v-if="gameState === 'jugando' || gameState === 'validando'" class="juego-screen">
        
        <div class="juego-header">
          <div class="counter">Situación {{ currentQIndex + 1 }} / {{ questions.length }}</div>
          <div class="timer-bar-container">
            <div class="timer-bar" 
                 :style="{ 
                   width: `${(timeLeft / maxTime) * 100}%`,
                   backgroundColor: barColor 
                 }">
            </div>
          </div>
        </div>

        <!-- Imagen de la situación -->
        <div class="image-container">
          <img :src="currentQuestion.imagen" alt="Situación de Supervivencia" />
        </div>

        <h2 class="question-text">{{ currentQuestion.texto }}</h2>

        <!-- Rejilla de opciones -->
        <div class="options-grid">
          <button v-for="opt in currentQuestion.opciones" :key="opt.id" 
                  class="option-btn"
                  :class="{
                    'correct': gameState === 'validando' && opt.correcta,
                    'incorrect': gameState === 'validando' && selectedChoice && selectedChoice.id === opt.id && !opt.correcta,
                    'disabled': gameState === 'validando'
                  }"
                  @click="selectOption(opt)"
                  :disabled="gameState === 'validando'">
            {{ opt.texto }}
          </button>
        </div>

        <!-- Feedback después de elegir -->
        <div v-if="gameState === 'validando'" class="feedback-box" :class="selectedChoice?.correcta ? 'good' : 'bad'">
          <h3 v-if="selectedChoice?.timeout">¡Tiempo Agotado! ⏳</h3>
          <h3 v-else>{{ selectedChoice?.correcta ? '¡Decisión Correcta! ✅' : '¡Terrible Decisión! ☠️' }}</h3>
          <p>{{ currentQuestion.explicacion }}</p>
        </div>

      </div>

      <!-- PANTALLA: RESULTADOS -->
      <div v-if="gameState === 'resultados'" class="resultados-screen">
        <h1>Análisis de Supervivencia</h1>
        <div class="score-circle">
          <span>{{ percentage }}%</span>
        </div>
        <h2>{{ feedbackData.emoji }} {{ feedbackData.msg }}</h2>
        <p class="desc">{{ feedbackData.desc }}</p>
        <p class="stats">Acertaste {{ score }} de {{ questions.length }} situaciones.</p>
        
        <!-- REGISTRO DE PUNTUACIÓN -->
        <!-- Usamos el porcentaje o una escala de puntos. 
             Vamos a darle 1000 puntos por cada acierto para que sea consistente con los otros juegos. -->
        <ScoreRegistration :score="score * 1000" gameName="Sobrevive en CR" />

        <div class="action-buttons">
          <button @click="startGame" class="btn-primary">Sobrevivir de Nuevo</button>
          <button @click="$router.push('/quizzes')" class="btn-secondary">Volver al Menú</button>
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

/* Efecto de lluvia con CSS pura */
.rain-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 1;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
  background-size: 4px 60px;
  animation: raining 0.4s linear infinite;
  opacity: 0.7;
}

@keyframes raining {
  0% { background-position: 0% 0%; }
  100% { background-position: 20% 100vh; } 
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
  background: rgba(0, 0, 0, 0.4);
}

.sobrevive-wrapper {
  position: relative;
  z-index: 10;
  max-width: 800px;
  width: 100%;
  padding: 1rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-primary {
  background: var(--accent-green-dark);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 5px 15px rgba(22, 163, 74, 0.3);
  margin: 0.5rem;
}
.btn-primary:hover {
  transform: translateY(-2px);
  background: var(--accent-green);
}

.btn-secondary {
  background: white;
  color: var(--text-main);
  border: 2px solid var(--border-color);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0.5rem;
}
.btn-secondary:hover { background: #f1f5f9; }

.inicio-screen {
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  margin-top: 2rem;
}
.inicio-screen h1 {
  font-size: 2.5rem;
  color: var(--accent-green-dark);
  margin-bottom: 1rem;
}
.rules {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 300px;
  text-align: left;
  font-weight: bold;
  color: var(--text-muted);
}

.juego-screen {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.juego-header { margin-bottom: 1.5rem; }
.counter { font-weight: bold; color: var(--text-muted); margin-bottom: 0.5rem; text-align: right; }
.timer-bar-container { width: 100%; height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden; }
.timer-bar { height: 100%; transition: width 1s linear, background-color 0.5s; }

.image-container {
  width: 100%; height: 250px; border-radius: 12px; overflow: hidden; margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.image-container img { width: 100%; height: 100%; object-fit: cover; }

.question-text { font-size: 1.3rem; color: var(--text-main); margin-bottom: 2rem; line-height: 1.5; }

.options-grid { display: flex; flex-direction: column; gap: 1rem; }
.option-btn {
  background: white; border: 2px solid var(--border-color); padding: 1.2rem; border-radius: 12px;
  font-size: 1.1rem; color: var(--text-main); cursor: pointer; transition: all 0.2s; text-align: left; font-weight: 600;
}
.option-btn:not(.disabled):hover { background: #f8fafc; border-color: #cbd5e1; transform: translateX(5px); }
.option-btn.correct { background: rgba(34, 197, 94, 0.1); border-color: var(--accent-green); color: var(--accent-green-dark); }
.option-btn.incorrect { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #b91c1c; }
.option-btn.disabled { cursor: default; }

.feedback-box { margin-top: 1.5rem; padding: 1.5rem; border-radius: 12px; animation: fadeIn 0.3s; }
.feedback-box.good { background: rgba(34, 197, 94, 0.1); border-left: 5px solid var(--accent-green); }
.feedback-box.bad { background: rgba(239, 68, 68, 0.1); border-left: 5px solid #ef4444; }
.feedback-box h3 { margin-bottom: 0.5rem; }

.resultados-screen {
  text-align: center; background: white; padding: 3rem 2rem; border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-top: 2rem;
}

.score-circle {
  width: 150px; height: 150px; border-radius: 50%; background: var(--accent-green-light);
  display: flex; align-items: center; justify-content: center; margin: 2rem auto;
  border: 8px solid var(--accent-green); box-shadow: 0 10px 25px rgba(34, 197, 94, 0.2);
}
.score-circle span { font-size: 3rem; font-weight: 900; color: white; text-shadow: 1px 2px 5px rgba(0,0,0,0.2); }

.resultados-screen h2 { font-size: 2rem; margin-bottom: 1rem; color: var(--text-main); }
.resultados-screen .desc { font-size: 1.2rem; color: var(--text-muted); margin-bottom: 2rem; }
.resultados-screen .stats { font-weight: bold; color: var(--accent-green-dark); margin-bottom: 2rem; }

@media (max-width: 600px) {
  .image-container { height: 180px; }
  .question-text { font-size: 1.1rem; }
  .option-btn { font-size: 1rem; padding: 1rem; }
}
</style>
