<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { drawSprite } from '../../composables/useFightGame.js'
import { SIZES } from '../../data/fighters.js'

const props = defineProps({
  fighter: Object,
  size: { type: Number, default: 120 },
  animate: { type: Boolean, default: true }
})

const canvasRef = ref(null)
let animId = null
let start = Date.now()

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const f = props.fighter
  if (!f) return

  const fSize = SIZES[f.id] || { w: 48, h: 80 }
  const t = props.animate ? (Date.now() - start) / 1000 : 0
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Mock fighter object for drawSprite
  const mockF = {
    ...f,
    x: 0, y: 0,
    facing: 1,
    state: props.animate ? 'walk' : 'idle',
    shake: 0,
    hitCooldown: 0
  }

  ctx.save()
  // Center and scale
  const scale = (props.size / 100) * 0.8
  ctx.translate(canvas.width / 2 - (fSize.w * scale) / 2, canvas.height / 2 - (fSize.h * scale) / 2)
  ctx.scale(scale, scale)
  
  // We need to bypass GROUND_Y in drawSprite for previews
  // Since GROUND_Y is a constant in useFightGame, we'll just accept the shadow might be off-canvas or we can translate sy.
  // Actually drawSprite uses sy = f.y which we set to 0.
  
  drawSprite(ctx, mockF, t)
  ctx.restore()

  if (props.animate) {
    animId = requestAnimationFrame(draw)
  }
}

onMounted(() => {
  draw()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})

watch(() => props.fighter, () => {
  if (!props.animate) draw()
}, { deep: true })
</script>

<template>
  <canvas 
    ref="canvasRef" 
    :width="size" 
    :height="size" 
    class="fighter-preview-canvas"
  ></canvas>
</template>

<style scoped>
.fighter-preview-canvas {
  display: block;
  image-rendering: pixelated;
}
</style>
