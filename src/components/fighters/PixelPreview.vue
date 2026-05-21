<script setup>
/**
 * PixelPreview.vue
 * Mini canvas que renderiza el sprite pixel art de un personaje.
 * Usado en el roster de selección y en los paneles laterales.
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { drawPixelSprite, PIXEL } from '../../game/sprites.js'

const props = defineProps({
  fighter: { type: Object, required: true },
  scale:   { type: Number, default: 1 },   // multiplicador de escala (1 = 64x96, 1.5 = 96x144...)
  animate: { type: Boolean, default: true }
})

// El sprite base es 16×24 píxeles × PIXEL(4) = 64×96
const BASE_W = 16 * PIXEL
const BASE_H = 24 * PIXEL

const canvasRef = ref(null)
let animId = null
let startT = 0

const mockFighter = (fighter, animT) => ({
  ...fighter,
  x: 0,
  y: 0,
  facing: 1,
  state: 'idle',
  cooldowns: { hit: 0 },
  hitCooldown: 0,
  animT
})

const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const now = performance.now()
  const animT = props.animate ? (now - startT) / 1000 : 0

  ctx.save()
  ctx.scale(props.scale, props.scale)
  drawPixelSprite(ctx, mockFighter(props.fighter, animT), animT)
  ctx.restore()
}

const tick = () => {
  draw()
  if (props.animate) {
    animId = requestAnimationFrame(tick)
  }
}

const startAnimation = () => {
  if (animId) return
  startT = performance.now()
  animId = requestAnimationFrame(tick)
}

const stopAnimation = () => {
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
}

onMounted(() => {
  if (props.animate) {
    startAnimation()
  } else {
    draw()
  }
})

onUnmounted(() => {
  stopAnimation()
})

// Observador completo y reactivo para cambios de personaje y de estado de animación
watch(
  [() => props.fighter, () => props.animate],
  ([newFighter, newAnimate], [oldFighter, oldAnimate]) => {
    if (newAnimate) {
      startAnimation()
    } else {
      stopAnimation()
      draw()
    }
  },
  { deep: true }
)
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="BASE_W * scale"
    :height="BASE_H * scale"
    class="pixel-preview"
  />
</template>

<style scoped>
.pixel-preview {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
