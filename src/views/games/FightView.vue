<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { sfx } from '../../composables/useFightGame.js'
import { initGameState } from '../../game/engine.js'
import CharacterSelect from '../../components/fighters/CharacterSelect.vue'
import FightGame from '../../components/fighters/FightGame.vue'
import VersusScreen from '../../components/fighters/VersusScreen.vue'

const router = useRouter()
const phase = ref('select') // select, versus, fight
const selectedFighters = ref({ p1: null, p2: null })
const gameState = ref(null)
const keys = reactive({})
const containerRef = ref(null)
const isFullscreen = ref(false)

const bgImg = new Image()
bgImg.src = '/imagenes/pelea_redondel_pro.png'

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    containerRef.value?.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`)
    })
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// Escuchar cambios de pantalla completa nativos (tecla Esc, etc)
const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

const handleKeyDown = (e) => {
  keys[e.key] = true
  if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) e.preventDefault()
}
const handleKeyUp = (e) => { keys[e.key] = false }

const onFightersSelected = ({ p1, p2, difficulty }) => {
  selectedFighters.value = { p1, p2, difficulty }
  phase.value = 'versus'
}

const startFight = () => {
  const { p1, p2, difficulty } = selectedFighters.value
  gameState.value = initGameState(p1, p2, difficulty)
  gameState.value.bgImg = bgImg
  gameState.value.crowdAnim = 0
  phase.value = 'fight'
}

const restart = () => {
  phase.value = 'select'
  gameState.value = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <div ref="containerRef" class="fight-page" :class="{ 'is-fs': isFullscreen }">
    <!-- Global Fullscreen Toggle -->
    <button class="global-fs-toggle" @click="toggleFullscreen">
      {{ isFullscreen ? '⇲' : '⇱' }}
    </button>

    <Transition name="px-swap" mode="out-in">
      <div v-if="phase === 'select'" key="select" class="select-wrapper">
        <CharacterSelect @select="onFightersSelected" />
        <button class="back-btn" @click="router.push('/minijuegos')">◀ SALIR</button>
      </div>

      <div v-else-if="phase === 'versus'" key="versus" class="versus-wrapper">
        <VersusScreen 
          :p1="selectedFighters.p1" 
          :p2="selectedFighters.p2" 
          @complete="startFight" 
        />
      </div>

      <div v-else key="fight" class="fight-wrapper">
        <FightGame
          :gs="gameState"
          :keys="keys"
          :sfx="sfx"
          :isFullscreen="isFullscreen"
          @restart="restart"
          @exit="router.push('/minijuegos')"
          @toggleFs="toggleFullscreen"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fight-page {
  width: 100%;
  height: 100vh;
  background: #020617;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 255, 0, 0.012) 3px,
    rgba(0, 255, 0, 0.012) 4px
  );
}

.select-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.fight-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.back-btn {
  position: fixed;
  top: 80px; /* Alineado con el botón de pantalla completa */
  left: 20px;
  font-family: monospace;
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: 2px;
  background: #0f172a;
  border: 3px solid #1e293b;
  color: #475569;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 3px 3px 0 #000;
}
.back-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #000;
}

.fight-page.is-fs {
  background: #000;
}

.global-fs-toggle {
  position: fixed;
  top: 80px; /* Bajado un poco para que no choque con el header de la web si existe */
  right: 20px;
  background: #fbbf24;
  border: 2px solid #000;
  color: #000;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999; /* Super tope */
  font-size: 1.8rem;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s;
}

.global-fs-toggle:hover {
  border-color: #000;
  background: #fff;
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #000, 0 0 20px rgba(251, 191, 36, 0.6);
}

.px-swap-enter-active,
.px-swap-leave-active {
  transition: opacity 0.2s steps(4);
}
.px-swap-enter-from,
.px-swap-leave-to { opacity: 0; }
</style>
