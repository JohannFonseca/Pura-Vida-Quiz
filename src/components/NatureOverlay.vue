<script setup>
// Un componente visual sin lógica reactiva, puro CSS inmersivo.
</script>

<template>
  <div class="nature-overlay">
    
    <!-- Lianas Colgantes Esquina Superior -->
    <svg class="vine vine-left" viewBox="0 0 100 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 10,0 Q 40,50 20,100 T 30,200 T 10,300" fill="none" stroke="#22c55e" stroke-width="6" stroke-linecap="round" opacity="0.4"/>
      <!-- Hojitas atadas a la liana -->
      <path d="M 20,100 Q 0,110 5,120 Q 20,115 20,100 Z" fill="#16a34a" opacity="0.6"/>
      <path d="M 30,200 Q 50,190 45,180 Q 30,190 30,200 Z" fill="#15803d" opacity="0.6"/>
    </svg>

    <svg class="vine vine-right" viewBox="0 0 100 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 90,0 Q 50,70 70,130 T 60,250 T 90,300" fill="none" stroke="#4ade80" stroke-width="5" stroke-linecap="round" opacity="0.3"/>
      <!-- Hojitas -->
      <path d="M 70,130 Q 90,140 85,150 Q 70,145 70,130 Z" fill="#22c55e" opacity="0.5"/>
    </svg>

    <svg class="vine vine-middle" viewBox="0 0 100 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50,0 Q 20,80 40,150" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round" opacity="0.2"/>
    </svg>

    <!-- Partículas Naturales (Hojas Cayendo) -->
    <div class="leaf-container">
      <div v-for="i in 8" :key="i" class="leaf" :class="`leaf-${i}`">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
        </svg>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Contenedor Fijo Inerte (Cero interferencia con clicks) */
.nature-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none; /* IMPORTANTÍSIMO: Permite cliquear lo de atrás */
  z-index: 900; /* Flota encima de casi todo menos modales */
  overflow: hidden;
}

/* --- ANIMACIONES CSS DE LIANAS --- */
@keyframes sway {
  0% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
  100% { transform: rotate(-3deg); }
}

.vine {
  position: absolute;
  top: -10px;
  height: clamp(200px, 40vh, 400px);
  width: 60px;
  transform-origin: top center;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.vine-left { left: 5%; animation: sway 8s ease-in-out infinite alternate; }
.vine-right { right: 8%; animation: sway 11s ease-in-out infinite alternate-reverse; height: 45vh; }
.vine-middle { left: 45%; animation: sway 6s ease-in-out infinite alternate; height: 25vh; opacity: 0.5; }

/* --- ANIMACIONES CSS DE HOJAS CAYENDO --- */
@keyframes fall {
  0% { transform: translate(0, -10vh) rotate(0deg) scale(0.8); opacity: 0; }
  10% { opacity: 0.6; }
  50% { transform: translate(3vw, 50vh) rotate(180deg) scale(1); }
  90% { opacity: 0.5; }
  100% { transform: translate(-2vw, 110vh) rotate(360deg) scale(0.8); opacity: 0; }
}

.leaf-container {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
}

.leaf {
  position: absolute;
  top: -5%;
  color: #22c55e;
  opacity: 0; /* Oculta por defecto antes de animar */
  width: 24px; height: 24px;
}

/* Configuraciones Matemáticas de Caída Variada sin JS */
.leaf-1 { left: 10%; animation: fall 14s linear infinite; animation-delay: 2s; color: #16a34a; width: 28px; }
.leaf-2 { left: 25%; animation: fall 18s linear infinite; animation-delay: 0s; color: #4ade80; width: 18px; filter: blur(1px);}
.leaf-3 { left: 40%; animation: fall 12s linear infinite; animation-delay: 6s; color: #15803d; }
.leaf-4 { left: 55%; animation: fall 22s linear infinite; animation-delay: 1s; color: #86efac; width: 32px; filter: blur(2px);}
.leaf-5 { left: 70%; animation: fall 16s linear infinite; animation-delay: 8s; color: #22c55e; }
.leaf-6 { left: 85%; animation: fall 15s linear infinite; animation-delay: 4s; color: #16a34a; width: 20px;}
.leaf-7 { left: 30%; animation: fall 19s linear infinite; animation-delay: 11s; color: #4ade80; width: 25px;}
.leaf-8 { left: 95%; animation: fall 13s linear infinite; animation-delay: 7s; color: #15803d; filter: blur(1px);}

</style>
