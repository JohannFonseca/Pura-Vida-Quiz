<script setup>
import { onMounted } from 'vue'
import PixelPreview from './PixelPreview.vue'

const props = defineProps({
  p1: Object,
  p2: Object
})

const emit = defineEmits(['complete'])

onMounted(() => {
  setTimeout(() => {
    emit('complete')
  }, 3500)
})
</script>

<template>
  <div class="versus-screen">
    <div class="background-flash"></div>
    
    <!-- P1 Entrance -->
    <div class="fighter-side p1-side">
      <div class="char-name p1-name">{{ p1.name.toUpperCase() }}</div>
      <div class="sprite-container">
        <PixelPreview :fighter="p1" :scale="3" :animate="true" />
      </div>
    </div>

    <!-- VS Text -->
    <div class="vs-center">
      <div class="vs-glow"></div>
      <div class="vs-text">VS</div>
    </div>

    <!-- P2 Entrance -->
    <div class="fighter-side p2-side">
      <div class="char-name p2-name">{{ p2.name.toUpperCase() }}</div>
      <div class="sprite-container">
        <PixelPreview :fighter="p2" :scale="3" :animate="true" />
      </div>
    </div>

    <!-- Overlay Text -->
    <div class="get-ready">GET READY!</div>
  </div>
</template>

<style scoped>
.versus-screen {
  position: fixed;
  inset: 0;
  background: #020617;
  display: flex;
  overflow: hidden;
  z-index: 200;
  font-family: monospace;
}

.background-flash {
  position: absolute;
  inset: 0;
  background: #fff;
  animation: flash 0.5s ease-out forwards;
  z-index: 10;
  pointer-events: none;
}

@keyframes flash {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.fighter-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.p1-side {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-right: 4px solid #22c55e;
  animation: slideInLeft 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

.p2-side {
  background: linear-gradient(-45deg, #0f172a 0%, #1e293b 100%);
  border-left: 4px solid #ef4444;
  animation: slideInRight 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.char-name {
  font-size: 3rem;
  font-weight: 950;
  color: #fff;
  letter-spacing: 10px;
  text-shadow: 4px 4px 0 #000;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeIn 0.4s ease-out 0.8s forwards;
}

.p1-name { color: #22c55e; }
.p2-name { color: #ef4444; }

.sprite-container {
  transform: scale(1.5);
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
  opacity: 0;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1s forwards;
}

@keyframes scaleIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1.5); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.vs-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(5);
  z-index: 100;
  opacity: 0;
  animation: vsIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.5s forwards;
}

@keyframes vsIn {
  0% { transform: translate(-50%, -50%) scale(10); opacity: 0; }
  70% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.vs-text {
  font-size: 8rem;
  font-weight: 950;
  color: #fff;
  font-style: italic;
  text-shadow: 0 0 20px #fbbf24, 8px 8px 0 #92400e;
}

.vs-glow {
  position: absolute;
  inset: -100px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.4), transparent 70%);
  animation: pulseVS 2s infinite;
}

@keyframes pulseVS {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 0.6; }
}

.get-ready {
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 4rem;
  color: #fbbf24;
  font-weight: 900;
  letter-spacing: 15px;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  opacity: 0;
  animation: blink 0.5s step-end infinite 2s;
}

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>
