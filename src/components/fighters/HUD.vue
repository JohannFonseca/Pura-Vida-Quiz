<script setup>
import { computed } from 'vue'

const props = defineProps({
  gs: Object
})

const p1HpPercent = computed(() => (props.gs.p1.hp / props.gs.p1.maxHp) * 100)
const p2HpPercent = computed(() => (props.gs.p2.hp / props.gs.p2.maxHp) * 100)
const timer = computed(() => Math.max(0, Math.ceil(props.gs.timer)))
</script>

<template>
  <div class="hud-layer">
    <!-- P1 Header -->
    <div class="fighter-info p1-info">
      <div class="hp-bar-container">
        <div class="hp-fill p1-fill" :style="{ width: p1HpPercent + '%' }">
          <div class="hp-glimmer"></div>
        </div>
        <div class="hp-delayed-fill" :style="{ width: p1HpPercent + '%' }"></div>
      </div>
      <div class="meta">
        <span class="name">{{ gs.p1.name.toUpperCase() }}</span>
        <div class="wins">
          <span class="wins-label">GANADOS</span>
          <div v-for="i in 2" :key="i" class="win-dot" :class="{ active: gs.roundWins?.p1 >= i }"></div>
        </div>
      </div>
    </div>

    <!-- Timer -->
    <div class="timer-container">
      <div class="timer-box">
        <span class="timer-num">{{ timer }}</span>
      </div>
      <div class="round-num">ROUND {{ gs.round || 1 }}</div>
    </div>

    <!-- P2 Header -->
    <div class="fighter-info p2-info">
      <div class="hp-bar-container flipped">
        <div class="hp-fill p2-fill" :style="{ width: p2HpPercent + '%' }">
          <div class="hp-glimmer"></div>
        </div>
        <div class="hp-delayed-fill" :style="{ width: p2HpPercent + '%' }"></div>
      </div>
      <div class="meta flipped">
        <span class="name">{{ gs.p2.name.toUpperCase() }}</span>
        <div class="wins">
          <span class="wins-label">GANADOS</span>
          <div v-for="i in 2" :key="i" class="win-dot" :class="{ active: gs.roundWins?.p2 >= i }"></div>
        </div>
      </div>
    </div>

    <!-- Announcement Overlay -->
    <Transition name="announcement">
      <div v-if="gs.announcement" class="announcement-wrap" :key="gs.announcement">
        <div class="announcement-text" :class="gs.announcement">
          <template v-if="gs.announcement === 'round'">
            <div class="announcement-round-container">
              <div class="round-title">ASALTO {{ gs.round || 1 }}</div>
              <div class="round-sub-countdown">{{ Math.max(1, Math.ceil(gs.countdown)) }}</div>
            </div>
          </template>
          <template v-else-if="gs.announcement === 'fight'">¡A PELEAR!</template>
          <template v-else-if="gs.announcement === 'p1_wins'">¡{{ gs.p1.name.toUpperCase() }} GANA!</template>
          <template v-else-if="gs.announcement === 'cpu_wins'">¡{{ gs.p2.name.toUpperCase() }} GANA!</template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.hud-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 30px 40px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  font-family: 'Outfit', sans-serif;
  z-index: 50;
}

.fighter-info {
  width: 38%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hp-bar-container {
  height: 24px;
  background: rgba(15, 23, 42, 0.8);
  border: 3px solid #000;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  overflow: hidden;
}

.hp-bar-container.flipped { transform: scaleX(-1); }

.hp-fill {
  height: 100%;
  background: linear-gradient(to bottom, #22c55e, #16a34a);
  position: relative;
  z-index: 2;
  transition: width 0.1s linear;
}

.p1-fill { background: linear-gradient(to bottom, #22c55e, #15803d); }
.p2-fill { background: linear-gradient(to bottom, #22c55e, #15803d); }

.hp-glimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent 60%);
}

.hp-delayed-fill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  background: #ef4444;
  z-index: 1;
  transition: width 0.6s cubic-bezier(0, 0, 0, 1);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.meta.flipped { flex-direction: row-reverse; }

.name {
  font-size: 1.2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 2px 2px 0 #000;
}

.wins { display: flex; gap: 6px; }
.win-dot {
  width: 12px;
  height: 12px;
  background: rgba(255,255,255,0.1);
  border: 2px solid #000;
  border-radius: 50%;
}
.win-dot.active {
  background: #fbbf24;
  box-shadow: 0 0 10px #fbbf24;
}

.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: -10px;
}

.timer-box {
  width: 70px;
  height: 70px;
  background: #0f172a;
  border: 4px solid #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}

.timer-num {
  font-size: 2.2rem;
  font-weight: 950;
  color: #fff;
}

.round-num {
  font-size: 0.7rem;
  font-weight: 900;
  color: #fbbf24;
  letter-spacing: 2px;
}

/* ── ANNOUNCEMENTS ── */
.announcement-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 100;
}

.announcement-text {
  font-size: 8rem;
  font-weight: 950;
  color: #fff;
  font-style: italic;
  text-shadow: 0 0 20px rgba(255,255,255,0.5), 10px 10px 0 #000;
  letter-spacing: 10px;
  animation: announcementPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.announcement-text.round {
  color: #fbbf24;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.5), 10px 10px 0 #000;
}

.announcement-round-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.round-title {
  font-size: 7rem;
  letter-spacing: 6px;
}

.round-sub-countdown {
  font-size: 9rem;
  font-weight: 950;
  color: #fff;
  text-shadow: 0 0 25px rgba(255,255,255,0.6), 8px 8px 0 #000;
  animation: countdownPulse 0.5s ease-out infinite alternate;
  font-family: monospace;
}

@keyframes countdownPulse {
  0% { transform: scale(0.9); }
  100% { transform: scale(1.1); }
}

.announcement-text.fight {
  color: #ef4444;
  text-shadow: 0 0 30px rgba(239, 68, 68, 0.5), 10px 10px 0 #000;
  font-size: 10rem;
}

.announcement-text.p1_wins {
  color: #22c55e;
  text-shadow: 0 0 30px rgba(34, 197, 94, 0.5), 10px 10px 0 #000;
  font-size: 6rem;
}

.announcement-text.cpu_wins {
  color: #ef4444;
  text-shadow: 0 0 30px rgba(239, 68, 68, 0.5), 10px 10px 0 #000;
  font-size: 6rem;
}

@keyframes announcementPop {
  0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}

.announcement-enter-active { transition: all 0.3s ease-out; }
.announcement-leave-active { transition: all 0.3s ease-in; }
.announcement-enter-from { transform: scale(2); opacity: 0; }
.announcement-leave-to { transform: scale(0.5); opacity: 0; filter: blur(20px); }
</style>
