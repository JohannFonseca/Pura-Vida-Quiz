<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { FISHING_ZONES, FISH_SPECIES } from '@/data/fishingData';

const router = useRouter();

// --- ESTADOS DEL JUEGO ---
// 'intro', 'map', 'fishing', 'result'
const gameState = ref('intro');
const currentZone = ref(null);
const caughtFish = ref(null);
const showUnlockAnimation = ref(false);
const unlockedZoneName = ref('');

// --- PROGRESIÓN (LocalStorage) ---
const playerStats = ref({
  level: 1,
  xp: 0,
  coins: 0,
  unlockedZones: ['papagayo'],
  totalCatches: 0,
  bestCombo: 0
});

// --- LÓGICA DE CARGA/GUARDADO ---
const loadProgress = () => {
  const saved = localStorage.getItem('pescaTica_progress');
  if (saved) {
    playerStats.value = JSON.parse(saved);
  }
};

const saveProgress = () => {
  localStorage.setItem('pescaTica_progress', JSON.stringify(playerStats.value));
};

// --- CÁLCULO DE NIVEL ---
const xpToNextLevel = computed(() => playerStats.value.level * 500);

const addXP = (amount) => {
  playerStats.value.xp += amount;
  if (playerStats.value.xp >= xpToNextLevel.value) {
    playerStats.value.xp -= xpToNextLevel.value;
    playerStats.value.level++;
    checkUnlocks();
  }
  saveProgress();
};

const checkUnlocks = () => {
  FISHING_ZONES.forEach(zone => {
    if (playerStats.value.level >= zone.nivelRequerido && !playerStats.value.unlockedZones.includes(zone.id)) {
      playerStats.value.unlockedZones.push(zone.id);
      triggerUnlockAnimation(zone.nombre);
    }
  });
};

const triggerUnlockAnimation = (name) => {
  unlockedZoneName.value = name;
  showUnlockAnimation.value = true;
  setTimeout(() => {
    showUnlockAnimation.value = false;
  }, 4000);
};

// --- MECÁNICA DE PESCA ---
const fishingPower = ref(0);
const isCasting = ref(false);
const isHooked = ref(false);
const timingProgress = ref(0);
const timingTarget = ref({ min: 40, max: 60 });
const fishingMessage = ref('¡Lanzá el anzuelo!');

let fishingInterval = null;

const startCasting = () => {
  if (gameState.value !== 'fishing' || isCasting.value) return;
  
  isCasting.value = true;
  fishingMessage.value = 'Esperando un pique...';
  
  // Tiempo aleatorio para que pique un pez
  const waitTime = 2000 + Math.random() * 3000;
  
  setTimeout(() => {
    if (gameState.value !== 'fishing') return;
    isHooked.value = true;
    fishingMessage.value = '¡ALGO PICÓ! ¡HALÁ YA!';
    startTimingMinigame();
  }, waitTime);
};

const startTimingMinigame = () => {
  timingProgress.value = 0;
  const zoneDifficulty = currentZone.value?.dificultad || 1;
  
  // El "target" es aleatorio
  const targetWidth = 20 - (zoneDifficulty * 2);
  const targetPos = 20 + Math.random() * (60 - targetWidth);
  timingTarget.value = { min: targetPos, max: targetPos + targetWidth };

  let direction = 1;
  const speed = 1 + (zoneDifficulty * 0.5);

  fishingInterval = setInterval(() => {
    timingProgress.value += direction * speed;
    if (timingProgress.value >= 100 || timingProgress.value <= 0) {
      direction *= -1;
    }
  }, 16);
};

const pullHook = () => {
  if (!isHooked.value) return;

  clearInterval(fishingInterval);
  
  const success = timingProgress.value >= timingTarget.value.min && timingProgress.value <= timingTarget.value.max;

  if (success) {
    resolveCatch();
  } else {
    fishingMessage.value = '¡Se escapó! Muy lento...';
    setTimeout(() => {
      resetFishingState();
    }, 2000);
  }
};

const resolveCatch = () => {
  const possibleFishKeys = currentZone.value.peces;
  const randomKey = possibleFishKeys[Math.floor(Math.random() * possibleFishKeys.length)];
  const fish = FISH_SPECIES[randomKey] || FISH_SPECIES['pargo_rojo'];
  
  caughtFish.value = fish;
  playerStats.value.coins += fish.valor;
  playerStats.value.totalCatches++;
  addXP(fish.xp);
  
  gameState.value = 'result';
};

const resetFishingState = () => {
  isCasting.value = false;
  isHooked.value = false;
  timingProgress.value = 0;
  fishingMessage.value = '¡Lanzá el anzuelo!';
};

// --- NAVEGACIÓN ---
const selectZone = (zone) => {
  if (!playerStats.value.unlockedZones.includes(zone.id)) return;
  currentZone.value = zone;
  gameState.value = 'fishing';
  resetFishingState();
};

const backToMap = () => {
  gameState.value = 'map';
  caughtFish.value = null;
};

const isTransitioning = ref(false);

const startFromIntro = () => {
  isTransitioning.value = true;
  setTimeout(() => {
    gameState.value = 'map';
    isTransitioning.value = false;
  }, 1500);
};

onMounted(() => {
  loadProgress();
});
</script>

<template>
  <div class="pesca-tica-container" :style="gameState === 'fishing' ? { background: currentZone.fondo } : {}">
    
    <!-- ════════ HUD SUPERIOR ════════ -->
    <div v-if="gameState !== 'intro'" class="hud-container">
      <div class="hud-item level-badge">
        <span class="label">NIVEL</span>
        <span class="value">{{ playerStats.level }}</span>
      </div>
      <div class="hud-item xp-bar-container">
        <div class="xp-info">
          <span>XP: {{ playerStats.xp }} / {{ xpToNextLevel }}</span>
        </div>
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: (playerStats.xp / xpToNextLevel * 100) + '%' }"></div>
        </div>
      </div>
      <div class="hud-item coins-badge">
        <span class="emoji">🪙</span>
        <span class="value">{{ playerStats.coins }}</span>
      </div>
      <button class="exit-btn" @click="router.push('/minijuegos')">✕</button>
    </div>

    <!-- ════════ PANTALLA: INTRO ════════ -->
    <div v-if="gameState === 'intro'" class="screen intro-screen" :class="{ 'fade-out': isTransitioning }">
      <div class="boat-animation" :class="{ 'sailing': isTransitioning }">
        <div class="boat">🚤</div>
        <div class="waves">
          <div class="wave"></div>
          <div class="wave"></div>
        </div>
      </div>
      <h1 class="game-title">Pesca <em>Tica</em></h1>
      <p class="game-subtitle">Simulador de pesca artesanal y deportiva</p>
      <button class="start-btn" :disabled="isTransitioning" @click="startFromIntro">
        {{ isTransitioning ? 'Zarpando...' : 'Explorar Costa Rica' }}
      </button>
    </div>

    <!-- ════════ PANTALLA: MAPA ════════ -->
    <div v-if="gameState === 'map'" class="screen map-screen">
      <h2 class="section-title">Seleccioná tu zona de pesca</h2>
      
      <div class="map-container">
        <!-- SVG Simplificado de Costa Rica -->
        <svg viewBox="0 0 500 450" class="cr-map-svg">
          <path d="M120,40 L180,20 L250,50 L320,30 L400,60 L450,150 L420,220 L480,280 L420,350 L350,420 L280,380 L200,350 L150,300 L100,250 L50,180 L80,100 Z" 
                fill="#2d5a27" stroke="#1a3317" stroke-width="2" />
          
          <!-- Puntos de Pesca -->
          <g v-for="zone in FISHING_ZONES" :key="zone.id" 
             class="map-point" 
             :class="{ locked: !playerStats.unlockedZones.includes(zone.id) }"
             @click="selectZone(zone)">
            
            <circle :cx="zone.coordenadas.x * 5" :cy="zone.coordenadas.y * 4.5" r="12" :fill="zone.color" />
            <circle v-if="!playerStats.unlockedZones.includes(zone.id)" :cx="zone.coordenadas.x * 5" :cy="zone.coordenadas.y * 4.5" r="14" fill="rgba(0,0,0,0.5)" />
            <text v-if="!playerStats.unlockedZones.includes(zone.id)" :x="zone.coordenadas.x * 5" :y="zone.coordenadas.y * 4.5 + 5" text-anchor="middle" font-size="12">🔒</text>
            
            <!-- Tooltip / Label -->
            <g class="point-info">
              <rect :x="zone.coordenadas.x * 5 - 60" :y="zone.coordenadas.y * 4.5 - 60" width="120" height="45" rx="8" fill="white" stroke="#ccc" />
              <text :x="zone.coordenadas.x * 5" :y="zone.coordenadas.y * 4.5 - 42" text-anchor="middle" font-weight="bold" font-size="10" fill="#333">{{ zone.nombre }}</text>
              <text :x="zone.coordenadas.x * 5" :y="zone.coordenadas.y * 4.5 - 28" text-anchor="middle" font-size="9" fill="#666">
                {{ playerStats.unlockedZones.includes(zone.id) ? 'Dificultad: ' + '⭐'.repeat(zone.dificultad) : 'Req. Nivel ' + zone.nivelRequerido }}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div class="map-legend">
        <p>Haz click en un punto desbloqueado para empezar a pescar.</p>
      </div>
    </div>

    <!-- ════════ PANTALLA: PESCA ════════ -->
    <div v-if="gameState === 'fishing'" class="screen fishing-screen">
      <div class="fishing-env">
        <div class="water-bg"></div>
        <div class="boat-top">🚤</div>
        
        <div class="fishing-ui">
          <h2 class="zone-name">{{ currentZone.nombre }}</h2>
          <p class="status-msg">{{ fishingMessage }}</p>

          <!-- El Anzuelo -->
          <div class="hook-container" :class="{ 'casting': isCasting, 'hooked': isHooked }">
            <div class="line"></div>
            <div class="hook">🪝</div>
            <div v-if="isHooked" class="fish-splash">💦</div>
          </div>

          <!-- Barra de Timing -->
          <div v-if="isHooked" class="timing-bar-container">
            <div class="timing-bar">
              <div class="target-zone" :style="{ left: timingTarget.min + '%', width: (timingTarget.max - timingTarget.min) + '%' }"></div>
              <div class="timing-pointer" :style="{ left: timingProgress + '%' }"></div>
            </div>
            <button class="pull-btn" @click="pullHook">¡HALAR!</button>
          </div>

          <button v-if="!isCasting" class="cast-btn" @click="startCasting">Lanzar Anzuelo</button>
          
          <button class="cancel-btn" @click="backToMap">Volver al Mapa</button>
        </div>
      </div>
    </div>

    <!-- ════════ PANTALLA: RESULTADO (CARTA DE PEZ) ════════ -->
    <div v-if="gameState === 'result' && caughtFish" class="screen result-screen">
      <div class="fish-card-overlay">
        <div class="fish-card">
          <div class="card-header" :style="{ background: currentZone.color }">
            <span class="rarity">{{ caughtFish.rareza }}</span>
            <h3>¡Captura Exitosa!</h3>
          </div>
          
          <div class="card-body">
            <div class="fish-emoji">🐟</div>
            <h2 class="fish-name">{{ caughtFish.nombre }}</h2>
            <p class="sci-name">{{ caughtFish.cientifico }}</p>
            <div class="fish-desc">{{ caughtFish.descripcion }}</div>
            
            <div class="fish-stats">
              <div class="stat">
                <span class="label">XP Ganada</span>
                <span class="val">+{{ caughtFish.xp }}</span>
              </div>
              <div class="stat">
                <span class="label">Monedas</span>
                <span class="val">+{{ caughtFish.valor }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <button class="continue-btn" @click="backToMap">Continuar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════ ANIMACIÓN DESBLOQUEO ════════ -->
    <div v-if="showUnlockAnimation" class="unlock-overlay">
      <div class="unlock-content">
        <div class="unlock-icon">🔓</div>
        <h2>¡NUEVA ZONA DESBLOQUEADA!</h2>
        <h1>{{ unlockedZoneName }}</h1>
        <p>¡Ya puedes viajar a este lugar!</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;900&display=swap');

.pesca-tica-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
  background: #f0f9ff;
  color: #0f172a;
  position: relative;
}

/* --- HUD --- */
.hud-container {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.hud-item {
  display: flex;
  flex-direction: column;
}

.level-badge {
  background: #0f172a;
  color: white;
  padding: 5px 15px;
  border-radius: 12px;
  text-align: center;
}

.level-badge .label { font-size: 0.6rem; font-weight: 900; opacity: 0.7; }
.level-badge .value { font-size: 1.2rem; font-weight: 900; }

.xp-bar-container {
  flex: 1;
}

.xp-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.xp-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #10b981);
  transition: width 0.4s ease;
}

.coins-badge {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background: #fef3c7;
  padding: 5px 15px;
  border-radius: 12px;
  border: 1px solid #fcd34d;
}
.coins-badge .value { font-weight: 900; color: #92400e; }

.exit-btn {
  background: #fee2e2;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #ef4444;
  font-weight: 900;
  cursor: pointer;
}

/* --- SCREENS --- */
.screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

/* --- INTRO --- */
.intro-screen {
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: white;
}

.game-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.game-title em { font-style: normal; color: #fde047; }

.game-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.start-btn {
  background: #fde047;
  color: #854d0e;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 900;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
.start-btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.3); }

.boat-animation {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: boatFloat 3s ease-in-out infinite;
}

@keyframes boatFloat {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

.boat-animation.sailing {
  animation: boatSail 1.5s ease-in forwards;
}

@keyframes boatSail {
  to { transform: translateX(100vw) translateY(-50px) scale(0.5); opacity: 0; }
}

.intro-screen.fade-out {
  transition: opacity 1s ease;
  opacity: 0.5;
  pointer-events: none;
}

/* --- MAP --- */
.map-screen {
  background: #e0f2fe;
}

.section-title {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 20px;
  color: #0369a1;
}

.map-container {
  width: 100%;
  max-width: 800px;
  background: rgba(255,255,255,0.5);
  border-radius: 30px;
  padding: 20px;
  box-shadow: inset 0 4px 10px rgba(0,0,0,0.05);
}

.cr-map-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1));
}

.map-point {
  cursor: pointer;
  transition: transform 0.3s;
}

.map-point:hover { transform: scale(1.1); }
.map-point.locked { cursor: not-allowed; opacity: 0.7; }

.point-info {
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.map-point:hover .point-info { opacity: 1; }

/* --- FISHING --- */
.fishing-screen {
  position: relative;
}

.fishing-ui {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
}

.zone-name { font-size: 2.5rem; font-weight: 900; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
.status-msg { font-size: 1.5rem; font-weight: 600; min-height: 2em; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }

.hook-container {
  margin: 40px auto;
  position: relative;
  width: 100px;
  height: 200px;
}

.line {
  width: 2px;
  height: 100%;
  background: rgba(255,255,255,0.4);
  margin: 0 auto;
}

.hook {
  font-size: 3rem;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.casting .hook { animation: cast 0.5s ease-out; }
.hooked .hook { animation: shake 0.2s infinite; }

@keyframes shake {
  0%, 100% { transform: translateX(-50%) rotate(0); }
  25% { transform: translateX(-60%) rotate(-10deg); }
  75% { transform: translateX(-40%) rotate(10deg); }
}

.timing-bar-container {
  width: 300px;
  margin: 20px auto;
}

.timing-bar {
  width: 100%;
  height: 20px;
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.target-zone {
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(34, 197, 94, 0.6);
}

.timing-pointer {
  position: absolute;
  top: 0;
  width: 4px;
  height: 100%;
  background: white;
  box-shadow: 0 0 10px white;
}

.pull-btn, .cast-btn {
  background: #fde047;
  color: #854d0e;
  border: none;
  padding: 15px 50px;
  font-size: 1.5rem;
  font-weight: 900;
  border-radius: 15px;
  cursor: pointer;
}

.cancel-btn {
  margin-top: 20px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
}

/* --- RESULT CARD --- */
.result-screen {
  background: rgba(0,0,0,0.8);
  z-index: 200;
  position: fixed;
  inset: 0;
}

.fish-card {
  width: 350px;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  animation: cardPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes cardPop {
  from { transform: scale(0.5) translateY(100px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.card-header {
  padding: 20px;
  color: white;
  text-align: center;
}

.rarity {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 900;
  background: rgba(0,0,0,0.2);
  padding: 4px 12px;
  border-radius: 20px;
}

.card-body {
  padding: 30px;
  text-align: center;
}

.fish-emoji { font-size: 5rem; margin-bottom: 10px; }
.fish-name { font-size: 2rem; font-weight: 900; margin: 0; }
.sci-name { font-style: italic; color: #64748b; margin-bottom: 20px; }
.fish-desc { font-size: 0.95rem; line-height: 1.6; color: #334155; margin-bottom: 30px; }

.fish-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}

.stat .label { display: block; font-size: 0.7rem; color: #94a3b8; font-weight: 700; }
.stat .val { font-size: 1.2rem; font-weight: 900; color: #0ea5e9; }

.card-footer {
  padding: 20px;
}

.continue-btn {
  width: 100%;
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 15px;
  font-weight: 900;
  font-size: 1.1rem;
  cursor: pointer;
}

/* --- UNLOCK ANIMATION --- */
.unlock-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.unlock-content {
  animation: unlockPop 1s ease;
}

@keyframes unlockPop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.unlock-icon { font-size: 6rem; margin-bottom: 20px; }

/* Responsive */
@media (max-width: 600px) {
  .game-title { font-size: 2.5rem; }
  .hud-container { gap: 10px; padding: 5px 10px; }
  .xp-bar-container { display: none; }
  .map-container { padding: 5px; }
  .fish-card { width: 90%; }
}
</style>
