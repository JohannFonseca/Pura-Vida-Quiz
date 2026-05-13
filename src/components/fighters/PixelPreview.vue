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

const draw = (ts) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const animT = props.animate ? (ts - startT) / 1000 : 0

  ctx.save()
  ctx.scale(props.scale, props.scale)
  drawPixelSprite(ctx, mockFighter(props.fighter, animT), animT)
  ctx.restore()

  if (props.animate) animId = requestAnimationFrame(draw)
}

onMounted(() => {
  startT = performance.now()
  if (props.animate) {
    animId = requestAnimationFrame(draw)
  } else {
    draw(0)
  }
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})

// Redibujar cuando cambia el personaje
watch(() => props.fighter, () => {
  if (!props.animate) {
    startT = performance.now()
    draw(0)
  }
})
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
