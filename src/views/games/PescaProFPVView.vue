<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';

const router = useRouter();

// --- ESTADO DEL JUEGO (STATE) ---
// Aquí guardamos en qué pantalla estamos ('intro', 'lore', 'map', 'game', 'result')
// Es reactivo, así que si cambia, Vue re-renderiza el componente automáticamente.
const scene = ref('intro'); 

// phase controla el estado dentro del minijuego de pesca (esperando, cargando fuerza, pescando)
const phase = ref('idle');

// Guardamos el nombre del jugador. Si ya jugó antes, lo sacamos del localStorage
// Todo: A futuro, tal vez mover esto a un Pinia store si la app crece mucho
const playerName = ref(localStorage.getItem('playerName') || '');
const loreStep = ref(0);

const loreDialogs = computed(() => [
  `¡Pura vida, ${playerName.value || 'pescador'}! Bienvenido a las aguas del Golfo de Nicoya. Aquí nacen las verdaderas leyendas del océano.`,
  `He pescado en estas costas por más de 40 años. He visto mareas que tragan barcos enteros y peces que podrían volcar tu panga de un solo coletazo.`,
  `El mar respeta a quien lo respeta. Te he dejado mi mejor panga, la famosa "Sol y Mar". Cuídala con tu vida.`,
  `Revisa el mapa, escoge tu primer destino y demuestra de qué estás hecho. ¡Que haya buena pesca!`
]);

// --- PROGRESIÓN Y ESTADÍSTICAS ---
// Recuperamos el progreso guardado. Usamos parseInt porque localStorage guarda strings
const stats = ref({
  level: parseInt(localStorage.getItem('pesca_level')) || 1,
  xp: parseInt(localStorage.getItem('pesca_xp')) || 0,
  coins: parseInt(localStorage.getItem('pesca_coins')) || 5000,
  catches: JSON.parse(localStorage.getItem('pesca_catches') || '[]') // Array de peces capturados
});

const saveStats = () => {
  localStorage.setItem('pesca_level', stats.value.level);
  localStorage.setItem('pesca_xp', stats.value.xp);
  localStorage.setItem('pesca_coins', stats.value.coins);
  localStorage.setItem('pesca_catches', JSON.stringify(stats.value.catches));
};

// --- DATA ---
const FISHING_ZONES = [
  { id: 'papagayo', name: 'Golfo de Papagayo', level: 1, color: '#00C9B1', pos: { x: 25, y: 30 } },
  { id: 'caldera', name: 'Puerto Caldera', level: 3, color: '#FFB347', pos: { x: 45, y: 55 } },
  { id: 'ballena', name: 'Bahía Ballena', level: 8, color: '#FF4B2B', pos: { x: 65, y: 75 } },
  { id: 'coco', name: 'Isla del Coco', level: 15, color: '#9b59b6', pos: { x: 15, y: 85 } }
];

const FISH_SPECIES = [
  { id: 'mahi', name: 'Mahi-Mahi', img: '/imagenes/peces/mahi_mahi.png', rarity: 'Épico', diff: 5, minW: 15, maxW: 45, val: 120000, color: '#f1c40f' },
  { id: 'sailfish', name: 'Pez Vela', img: '/imagenes/peces/pez_vela.png', rarity: 'Legendario', diff: 9, minW: 30, maxW: 110, val: 450000, color: '#3498db' },
  { id: 'pargo', name: 'Pargo Rojo', emoji: '🐠', rarity: 'Común', diff: 2, minW: 2, maxW: 10, val: 15000, color: '#e74c3c' },
  { id: 'tuna', name: 'Atún Aleta Amarilla', emoji: '🐟', rarity: 'Raro', diff: 6, minW: 20, maxW: 80, val: 200000, color: '#2c3e50' }
];

const BAITS = [
  { id: 'camaron', name: 'Camarón Vivo', emoji: '🦐', qty: 15, power: 2 },
  { id: 'pulpo', name: 'Pulpo', emoji: '🐙', qty: 5, power: 4 },
  { id: 'senuelo', name: 'Señuelo Pro', emoji: '🎣', qty: 1, power: 8 }
];

const selectedBait = ref(BAITS[0]);
const currentZone = ref(FISHING_ZONES[0]);

// Variables para controlar el minijuego de pesca (el "combate")
const chargeValue = ref(0); // Fuerza del lanzamiento (0 a 100)
const tensionValue = ref(50); // Tensión de la cuerda (si llega a 100 o 0, pierdes)
const fishHealth = ref(100); // Vida del pez
const combatFish = ref(null); // El pez actual con el que estamos peleando
const safeZone = ref({ pos: 30, width: 25 }); // La zona verde en la barra donde debes mantener la tensión
const isReeling = ref(false); // ¿El jugador está apretando el botón para recoger el hilo?

// Variables normales (no reactivas) para el loop del juego, por rendimiento
let chargeDir = 1;
let gameLoop = null;

// --- AUDIO SYSTEM ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (freq, type, dur, vol = 0.1) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
};

// --- ACTIONS ---
const startApp = () => {
  if (playerName.value) {
    localStorage.setItem('playerName', playerName.value);
    scene.value = 'lore';
  }
};

const nextLore = () => {
  if (loreStep.value < loreDialogs.value.length - 1) {
    loreStep.value++;
  } else {
    scene.value = 'map';
  }
};

const selectZone = (zone) => {
  if (stats.value.level >= zone.level) {
    currentZone.value = zone;
    scene.value = 'game';
    setTimeout(() => {
        gsap.from('.game-bg', { scale: 1.5, duration: 2, ease: 'power2.out' });
    }, 100);
  }
};

const startCharging = () => {
  if (phase.value !== 'idle') return;
  phase.value = 'charging';
  chargeValue.value = 0;
  
  gameLoop = setInterval(() => {
    chargeValue.value += chargeDir * 3;
    if (chargeValue.value >= 100 || chargeValue.value <= 0) chargeDir *= -1;
  }, 20);
};

const releaseCast = () => {
  if (phase.value !== 'charging') return;
  clearInterval(gameLoop);
  phase.value = 'waiting';
  playSound(200, 'sine', 0.5, 0.2);
  
  const waitTime = 3000 + Math.random() * (7000 / selectedBait.value.power);
  setTimeout(() => {
    if (phase.value === 'waiting') {
      phase.value = 'biting';
      playSound(800, 'square', 0.2, 0.3);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, waitTime);
};

const hookFish = () => {
  if (phase.value !== 'biting') return;
  
  const pool = FISH_SPECIES.filter(f => f.diff <= stats.value.level + 5);
  combatFish.value = pool[Math.floor(Math.random() * pool.length)];
  combatFish.value.weight = (combatFish.value.minW + Math.random() * (combatFish.value.maxW - combatFish.value.minW)).toFixed(1);
  
  phase.value = 'combat';
  fishHealth.value = 100;
  tensionValue.value = 50;
  startCombatLoop();
};

// Esta es la función central: El bucle de combate a 60fps usando requestAnimationFrame
// Todo: A futuro, tal vez sacar esta lógica a una clase separada (ej. CombatEngine.js) para tener el código más limpio
const startCombatLoop = () => {
  let lastTime = performance.now();
  
  const loop = (time) => {
    if (phase.value !== 'combat') return; // Si ya no estamos en combate, salimos del bucle
    
    // dt (delta time) nos ayuda a que el juego corra a la misma velocidad en todas las pantallas
    const dt = time - lastTime;
    lastTime = time;

    // IA básica del pez: Se mueve aleatoriamente por la barra
    const speed = combatFish.value.diff * 0.05;
    safeZone.value.pos += (Math.random() - 0.5) * speed * dt;
    // Evitamos que la zona segura se salga de los bordes
    if (safeZone.value.pos < 5) safeZone.value.pos = 5;
    if (safeZone.value.pos > 95 - safeZone.value.width) safeZone.value.pos = 95 - safeZone.value.width;

    if (isReeling.value) {
      tensionValue.value += 0.2 * dt;
      if (Math.random() > 0.8) playSound(100 + tensionValue.value, 'sawtooth', 0.05, 0.02);
      
      const isSafe = tensionValue.value >= safeZone.value.pos && tensionValue.value <= safeZone.value.pos + safeZone.value.width;
      if (isSafe) {
        fishHealth.value -= (10 / combatFish.value.diff) * (dt / 1000) * 10;
        if (fishHealth.value <= 0) winCombat();
      }
    } else {
      tensionValue.value -= 0.15 * dt;
    }

    if (tensionValue.value > 100 || tensionValue.value < 0) loseCombat();

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};

const winCombat = () => {
  phase.value = 'result';
  stats.value.coins += combatFish.value.val;
  stats.value.xp += Math.floor(combatFish.value.val / 100);
  stats.value.catches.push({ ...combatFish.value, date: new Date().toISOString() });
  
  if (stats.value.xp >= stats.value.level * 1000) {
    stats.value.level++;
    playSound(1000, 'sine', 1, 0.5);
  }
  
  saveStats();
  playSound(440, 'triangle', 0.5);
};

const loseCombat = () => {
  phase.value = 'idle';
  combatFish.value = null;
  playSound(100, 'sawtooth', 1, 0.3);
};

const backToMap = () => {
  scene.value = 'map';
  phase.value = 'idle';
};

const exitGame = () => {
    router.push('/minijuegos');
};

onMounted(() => {
  gsap.to('.bobbing', { y: 15, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
});

onUnmounted(() => {
  clearInterval(gameLoop);
});
</script>

<template>
  <!-- Teleport: Envía todo este HTML al <body> directamente, saltándose las restricciones de CSS de Vue
       Esto es vital para lograr un efecto real de pantalla completa sin que el Navbar estorbe -->
  <Teleport to="body">
    <div class="pesca-pro-wrapper">
      
      <!-- ================= SCENE: INTRO ================= -->
      <!-- <transition> permite hacer una animación (fade) cuando este div entra o sale del DOM -->
      <transition name="fade">
        <!-- v-if hace que este código SOLO exista en la memoria si scene === 'intro'. Mucho más óptimo que v-show -->
        <div v-if="scene === 'intro'" class="scene intro-scene">
          <div class="glass-hud intro-box">
            <h1 class="title-main">Pura Vida Pesca</h1>
            <p class="subtitle-main">Simulador Profesional FPV</p>
            
            <div class="input-group">
              <label class="label-tiny">Nombre del Capitán</label>
              <!-- v-model sincroniza automáticamente el input con la variable 'playerName' -->
              <input v-model="playerName" type="text" placeholder="Escribe tu nombre..." class="pro-input" />
            </div>
            
            <!-- :disabled es un atajo de v-bind:disabled. Si no hay nombre, el botón se bloquea -->
            <button @click="startApp" :disabled="!playerName" class="btn-primary">
              Zarpar Ahora
            </button>
            <!-- Llama a exitGame para volver al menú anterior usando vue-router -->
            <button @click="exitGame" class="btn-secondary mt-4">Cerrar</button>
          </div>
        </div>
      </transition>

      <!-- ================= SCENE: LORE ================= -->
      <transition name="fade">
        <div v-if="scene === 'lore'" class="scene intro-scene">
          <div class="glass-hud dialog-box">
            <div class="dialog-content">
              <div class="avatar-large">
                <img src="/imagenes/don_chepe.png" alt="Don Chepe" />
              </div>
              <div class="text-side">
                <span class="npc-name">Don Chepe</span>
                <p class="dialog-text">{{ loreDialogs[loreStep] }}</p>
                <button @click="nextLore" class="btn-primary mt-6">
                  {{ loreStep < loreDialogs.length - 1 ? 'Continuar' : 'Ir al Mapa' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- ================= SCENE: MAP ================= -->
      <transition name="fade">
        <div v-if="scene === 'map'" class="scene map-scene">
          <h2 class="title-secondary">Cartografía del Pacífico</h2>
          
          <div class="map-frame">
            <div class="map-overlay"></div>
            
            <!-- Renderizamos cada zona iterando sobre el array FISHING_ZONES usando v-for.
                 :key es obligatorio en Vue para que pueda trackear qué elementos cambian en el DOM -->
            <div v-for="zone in FISHING_ZONES" :key="zone.id" 
                 @click="selectZone(zone)"
                 class="map-marker"
                 :class="{ 'locked': stats.level < zone.level }"
                 :style="{ left: zone.pos.x + '%', top: zone.pos.y + '%' }">
              
              <div class="marker-core"></div>
              <div class="marker-ping" :style="{ backgroundColor: zone.color }"></div>
              
              <div class="marker-info">
                <p class="zone-name">{{ zone.name }}</p>
                <p class="zone-level" :style="{ color: zone.color }">Nivel {{ zone.level }}</p>
              </div>
            </div>
          </div>
          
          <button @click="exitGame" class="btn-secondary mt-8">Volver al Menú</button>
        </div>
      </transition>

      <!-- ================= SCENE: GAME ================= -->
      <transition name="fade">
        <div v-if="scene === 'game'" class="scene game-scene">
          
          <!-- Background -->
          <div class="game-bg bobbing" style="background-image: url('/imagenes/panga_fpv_view.png')"></div>
          <div class="vignette"></div>

          <!-- UI LAYER -->
          <div class="ui-overlay">
            
            <!-- TOP HUD -->
            <div class="hud-top">
              <div class="glass-hud profile-box">
                <div class="avatar">{{ playerName[0]?.toUpperCase() }}</div>
                <div class="profile-details">
                  <p class="player-name">Cap. {{ playerName }}</p>
                  <div class="xp-container">
                    <div class="xp-bar"><div class="xp-fill" :style="{ width: (stats.xp % 1000) / 10 + '%' }"></div></div>
                    <span class="level-badge">Nivel {{ stats.level }}</span>
                  </div>
                </div>
              </div>

              <div class="hud-right">
                <div class="glass-hud balance-box">
                  <span class="label-tiny">Balance</span>
                  <span class="coins-value">₡{{ stats.coins.toLocaleString() }}</span>
                </div>
                <button @click="backToMap" class="btn-map">Mapa</button>
              </div>
            </div>

            <!-- CENTER: ACTIONS -->
            <div class="center-actions">
              
              <!-- COMBAT -->
              <transition name="scale">
                <div v-if="phase === 'combat'" class="combat-display">
                  <div class="combat-ring">
                    <svg class="ring-svg">
                      <circle cx="140" cy="140" r="135" class="ring-bg" />
                      <circle cx="140" cy="140" r="135" class="ring-fill" 
                              :style="{ stroke: combatFish.color, strokeDashoffset: 848 * (1 - fishHealth / 100) }" />
                    </svg>

                    <div class="tension-slider">
                      <div class="safe-zone" :style="{ left: safeZone.pos + '%', width: safeZone.width + '%' }"></div>
                      <div class="tension-pin" :style="{ left: tensionValue + '%' }"></div>
                    </div>

                    <div class="combat-status">¡COMBATE ACTIVO!</div>
                  </div>

                  <button @pointerdown="isReeling = true" @pointerup="isReeling = false" class="btn-reel">
                    Cobrar Sedal
                  </button>
                </div>
              </transition>

              <!-- CONTROLS -->
              <div v-if="['idle', 'charging', 'biting'].includes(phase)" class="casting-controls">
                <div v-if="phase === 'charging'" class="power-meter">
                  <div class="power-track"><div class="power-fill" :style="{ height: chargeValue + '%' }"></div></div>
                  <span class="label-tiny">Potencia</span>
                </div>

                <button @pointerdown="startCharging" @pointerup="releaseCast" v-if="phase !== 'biting'" class="btn-cast">
                  <span v-if="phase === 'idle'">Lanzar Anzuelo</span>
                  <span v-else>Soltar...</span>
                </button>

                <button @click="hookFish" v-if="phase === 'biting'" class="btn-hook animate-bounce">
                  ¡PICA AHORA!
                </button>
              </div>

              <div v-if="phase === 'waiting'" class="waiting-box">
                <p class="waiting-text">Esperando una mordida...</p>
              </div>
            </div>

            <!-- BOTTOM -->
            <div class="hud-bottom">
              <div class="glass-hud bait-inventory" :class="{ 'hidden-inv': phase !== 'idle' }">
                <div v-for="bait in BAITS" :key="bait.id" 
                     @click="selectedBait = bait"
                     class="bait-item" :class="{ 'active': selectedBait.id === bait.id }">
                  <span class="bait-emoji">{{ bait.emoji }}</span>
                  <span class="bait-name">{{ bait.name.split(' ')[0] }}</span>
                  <span class="bait-qty">x{{ bait.qty }}</span>
                </div>
              </div>

              <div class="glass-hud radar-box">
                <span class="label-tiny">Ecosonda</span>
                <div class="radar-display">
                  <div class="radar-beam"></div>
                  <div class="fish-blip"></div>
                  <div v-if="phase === 'biting'" class="bite-ping"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- RESULT -->
          <transition name="scale">
            <div v-if="phase === 'result'" class="result-overlay">
              <div class="result-card">
                <span class="badge-legend">Captura Magistral</span>
                
                <div class="fish-visual">
                  <img v-if="combatFish.img" :src="combatFish.img" class="fish-img" />
                  <span v-else class="fish-emoji">{{ combatFish.emoji }}</span>
                </div>

                <h2 class="result-title">{{ combatFish.name }}</h2>
                <p class="result-weight">{{ combatFish.weight }} kg</p>

                <div class="result-stats">
                  <div class="stat-box"><p class="label-tiny">Premio</p><p class="stat-val gold">₡{{ combatFish.val.toLocaleString() }}</p></div>
                  <div class="stat-box"><p class="label-tiny">Exp</p><p class="stat-val blue">+{{ Math.floor(combatFish.val / 100) }} XP</p></div>
                </div>

                <button @click="phase = 'idle'; scene = 'game'" class="btn-primary w-full">Continuar Pesca</button>
              </div>
            </div>
          </transition>

        </div>
      </transition>

    </div>
  </Teleport>
</template>

<style scoped>
.pesca-pro-wrapper {
  position: fixed; inset: 0; background: #000; overflow: hidden;
  font-family: 'Nunito', sans-serif; color: #fff; z-index: 999999;
}

/* Scenes */
.scene { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.intro-scene { background: #0f172a; z-index: 100; }
.map-scene { background: #0f172a; z-index: 90; }
.game-scene { z-index: 50; }

/* HUD/Glass */
.glass-hud {
  background: rgba(10, 22, 40, 0.7); backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.intro-box { padding: 3rem; max-width: 450px; width: 90%; text-align: center; border-top: 4px solid #00C9B1; }
.title-main { font-family: 'Playfair Display', serif; font-size: 3rem; margin-bottom: 0.5rem; }
.subtitle-main { color: #00C9B1; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em; font-size: 0.8rem; margin-bottom: 2.5rem; }

/* Inputs & Buttons */
.input-group { margin-bottom: 2rem; text-align: left; }
.label-tiny { display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(255,255,255,0.4); letter-spacing: 0.2em; margin-bottom: 0.5rem; }
.pro-input { width: 100%; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1rem; color: #fff; font-size: 1.2rem; text-align: center; outline: none; transition: 0.3s; }
.pro-input:focus { border-color: #00C9B1; }

.btn-primary { background: linear-gradient(135deg, #FFB347, #FF8C00); color: #fff; font-weight: 900; text-transform: uppercase; padding: 1.2rem 2rem; border-radius: 16px; border: none; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(255,179,71,0.3); }
.btn-primary:hover { transform: scale(1.05) translateY(-3px); }
.btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; font-weight: bold; padding: 0.8rem 1.5rem; border-radius: 12px; cursor: pointer; }

/* Map */
.map-frame { position: relative; width: 90%; max-width: 900px; aspect-ratio: 16/10; background: rgba(255,255,255,0.02); border-radius: 32px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
.map-overlay { position: absolute; inset: 0; background-image: url('/imagenes/mapa_cr_pro.png'); background-size: cover; opacity: 0.2; filter: grayscale(1); }
.map-marker { position: absolute; transform: translate(-50%, -50%); cursor: pointer; z-index: 10; }
.marker-core { width: 16px; height: 16px; background: #fff; border-radius: 50%; box-shadow: 0 0 20px #fff; }
.marker-ping { position: absolute; top: 0; left: 0; width: 16px; height: 16px; border-radius: 50%; animation: ping 2s infinite; }
.marker-info { position: absolute; top: 25px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); padding: 0.5rem 1rem; border-radius: 10px; opacity: 0; transition: 0.3s; white-space: nowrap; }
.map-marker:hover .marker-info { opacity: 1; }
.zone-name { font-weight: bold; font-size: 0.9rem; }
.zone-level { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; }

/* Game */
.game-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.vignette { position: absolute; inset: 0; background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%); pointer-events: none; }
.ui-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 2rem; pointer-events: none; }

.hud-top { display: flex; justify-content: space-between; width: 100%; }
.profile-box { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; }
.avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(to tr, #00C9B1, #3498db); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; border: 2px solid rgba(255,255,255,0.2); }
.player-name { font-weight: bold; font-size: 1.1rem; }
.xp-container { display: flex; align-items: center; gap: 0.5rem; }
.xp-bar { width: 120px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.xp-fill { height: 100%; background: #00C9B1; transition: 0.5s; }
.level-badge { font-size: 10px; font-weight: 900; color: #00C9B1; text-transform: uppercase; }

.hud-right { display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; }
.balance-box { padding: 1rem 2rem; border-right: 4px solid #FFB347; text-align: right; }
.coins-value { font-family: 'DM Mono', monospace; font-size: 2rem; font-weight: 900; color: #FFB347; }
.btn-map { pointer-events: auto; background: rgba(10,22,40,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.6); padding: 0.5rem 1.5rem; font-weight: 900; text-transform: uppercase; font-size: 10px; cursor: pointer; transition: 0.3s; }
.btn-map:hover { color: #fff; background: rgba(255,255,255,0.1); }

/* Combat */
.center-actions { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.combat-display { display: flex; flex-direction: column; align-items: center; gap: 3rem; }
.combat-ring { position: relative; width: 280px; height: 280px; display: flex; align-items: center; justify-content: center; }
.ring-svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 10; }
.ring-fill { fill: none; stroke-width: 10; stroke-linecap: round; stroke-dasharray: 848; transition: 0.1s; }

.tension-slider { position: relative; width: 240px; height: 12px; background: rgba(0,0,0,0.5); border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.safe-zone { position: absolute; height: 100%; background: rgba(0, 201, 177, 0.4); border-left: 1px solid #00C9B1; border-right: 1px solid #00C9B1; }
.tension-pin { position: absolute; top: 0; width: 4px; height: 100%; background: #fff; box-shadow: 0 0 10px #fff; transition: 0.05s; }
.combat-status { position: absolute; top: -50px; font-weight: 900; text-transform: uppercase; color: #fff; letter-spacing: 0.3em; animation: pulse 1s infinite; }

.btn-reel { pointer-events: auto; background: linear-gradient(to right, #f97316, #dc2626); color: #fff; font-weight: 900; text-transform: uppercase; font-size: 1.2rem; padding: 1.5rem 4rem; border-radius: 20px; border: none; cursor: pointer; box-shadow: 0 15px 30px rgba(220,38,38,0.4); }

/* Controls */
.casting-controls { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
.power-meter { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.power-track { width: 12px; height: 200px; background: rgba(0,0,0,0.5); border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); position: relative; }
.power-fill { position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, #00C9B1, #FFB347, #FF4B2B); transition: 0.05s; }

.btn-cast { pointer-events: auto; background: linear-gradient(135deg, #FFB347, #FF8C00); color: #fff; font-weight: 900; font-size: 1.5rem; text-transform: uppercase; padding: 1.5rem 3.5rem; border-radius: 50px; border: none; cursor: pointer; box-shadow: 0 15px 40px rgba(255,179,71,0.4); }
.btn-hook { pointer-events: auto; background: #dc2626; color: #fff; font-weight: 900; font-size: 1.5rem; text-transform: uppercase; padding: 1.5rem 3.5rem; border-radius: 50px; border: none; cursor: pointer; box-shadow: 0 0 50px rgba(220,38,38,0.6); }

.waiting-box { background: rgba(10,22,40,0.8); padding: 1rem 2rem; border-radius: 50px; animation: pulse 2s infinite; }
.waiting-text { font-weight: 900; text-transform: uppercase; font-size: 10px; letter-spacing: 0.3em; }

/* Bottom */
.hud-bottom { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; }
.bait-inventory { pointer-events: auto; display: flex; gap: 1rem; padding: 1.5rem; transition: 0.5s; }
.hidden-inv { transform: translateY(150%); opacity: 0; }
.bait-item { width: 80px; height: 100px; border-radius: 16px; background: rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
.bait-item.active { background: rgba(255,255,255,0.1); border-color: #00C9B1; transform: scale(1.1); }
.bait-emoji { font-size: 2rem; }
.bait-name { font-size: 10px; font-weight: bold; text-transform: uppercase; margin-top: 4px; }
.bait-qty { font-family: 'DM Mono', monospace; color: #00C9B1; font-size: 10px; }

.radar-box { padding: 1.5rem; text-align: center; }
.radar-display { position: relative; width: 80px; height: 80px; border-radius: 50%; border: 2px solid rgba(0, 201, 177, 0.2); overflow: hidden; background: rgba(0, 201, 177, 0.05); }
.radar-beam { position: absolute; inset: 0; background: conic-gradient(from 0deg, transparent 80%, rgba(0, 201, 177, 0.3) 100%); animation: spin 3s linear infinite; }
.fish-blip { position: absolute; width: 6px; height: 6px; background: #00C9B1; border-radius: 50%; box-shadow: 0 0 10px #00C9B1; top: 30%; left: 60%; animation: pulse 1s infinite; }
.bite-ping { position: absolute; inset: 0; background: rgba(239, 68, 68, 0.2); animation: ping 1s infinite; }

/* Result */
.result-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(20px); }
.result-card { background: rgba(10,22,40,0.8); border: 1px solid rgba(255,255,255,0.1); padding: 4rem; border-radius: 40px; text-align: center; max-width: 450px; width: 90%; }
.badge-legend { background: #FFB347; color: #000; padding: 0.4rem 1.5rem; border-radius: 50px; font-weight: 900; text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em; margin-bottom: 2rem; display: inline-block; }
.fish-visual { margin-bottom: 2rem; position: relative; }
.fish-img { width: 100%; max-width: 300px; animation: bob 3s infinite; filter: drop-shadow(0 0 30px rgba(255,255,255,0.2)); }
.fish-emoji { font-size: 8rem; animation: bob 3s infinite; }
.result-title { font-family: 'Playfair Display', serif; font-size: 3.5rem; margin-bottom: 0.5rem; }
.result-weight { font-family: 'DM Mono', monospace; color: #00C9B1; font-size: 2rem; margin-bottom: 2.5rem; }
.result-stats { display: flex; gap: 1rem; margin-bottom: 3rem; }
.stat-box { flex: 1; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 20px; }
.stat-val { font-family: 'DM Mono', monospace; font-size: 1.2rem; font-weight: bold; }
.gold { color: #FFB347; }
.blue { color: #3498db; }

/* Animations & Transitions */
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

/* Dialog Box */
.dialog-box { max-width: 800px; width: 90%; padding: 0; overflow: hidden; border-top: 4px solid #FFB347; }
.dialog-content { display: flex; gap: 2rem; padding: 2rem; align-items: center; }
.avatar-large { width: 180px; height: 180px; border-radius: 20px; overflow: hidden; border: 3px solid #FFB347; flex-shrink: 0; }
.avatar-large img { width: 100%; height: 100%; object-fit: cover; }
.text-side { flex: 1; text-align: left; }
.npc-name { display: block; font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #FFB347; font-weight: bold; margin-bottom: 0.5rem; }
.dialog-text { font-size: 1.2rem; line-height: 1.5; color: rgba(255,255,255,0.9); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scale-enter-active, .scale-leave-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from, .scale-leave-to { transform: scale(0.8); opacity: 0; }

.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }
.w-full { width: 100%; }
</style>
