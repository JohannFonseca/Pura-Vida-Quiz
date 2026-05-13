<script setup>
/**
 * HomeView.vue — Landing page cinematográfica.
 * Hero full-bleed: rompe el contenedor de App.vue y llega a los bordes.
 * El mar se integra al fondo del hero, sin separación visual.
 */
import { ref, onMounted } from 'vue'

const loaded = ref(false)
onMounted(() => setTimeout(() => { loaded.value = true }, 80))

const quizCards = [
  { emoji: '🌴', title: 'Sobrevive en CR',   color: '#22c55e', rotate: '-5deg', top: '12%', left: '12%' },
  { emoji: '📍', title: '¿Dónde estoy?',     color: '#0ea5e9', rotate: '4deg',  top: '33%', left: '32%' },
  { emoji: '🗣️', title: 'Habla como Tico',  color: '#f59e0b', rotate: '-3deg', top: '56%', left: '10%' },
  { emoji: '⚡', title: 'Verdadero o Falso', color: '#a855f7', rotate: '6deg',  top: '73%', left: '30%' },
]
</script>

<template>
  <div class="home" :class="{ loaded }">

    <!-- ══ HERO FULL-BLEED ══════════════════════════════════ -->
    <section class="hero">

      <!-- Océano integrado al fondo del hero — sin separación -->
      <div class="hero-ocean" aria-hidden="true">
        <div class="ocean-img"></div>
      </div>

      <!-- Capas de fondo: gradiente oscuro encima del mar -->
      <div class="hero-bg" aria-hidden="true">
        <div class="mesh"></div>
        <div class="orb o1"></div>
        <div class="orb o2"></div>
        <div class="orb o3"></div>
      </div>

      <!-- Las lianas y hojas las maneja NatureOverlay (App.vue) globalmente -->

      <!-- ── Grid interior: texto | cards ── -->
      <div class="hero-inner">

        <!-- Columna izquierda: texto -->
        <div class="col-text">
          <div class="eyebrow">
            <span class="dot"></span>
            Costa Rica · Quiz Interactivo
          </div>

          <h1 class="headline">
            <span class="line1">¿Cuánto</span>
            <span class="line2">sabés de</span>
            <span class="line3">Costa Rica?</span>
          </h1>

          <p class="tagline">
            Quizzes, survival games y minijuegos arcade
            inspirados en la cultura tica. Gratis. Para siempre.
          </p>

          <div class="actions">
            <router-link to="/quizzes" class="cta-main">
              Empezar a Jugar
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
            <router-link to="/minijuegos" class="cta-sec">🎮 Minijuegos</router-link>
          </div>

          <div class="pill-row">
            <span class="pill">🧠 4 Quizzes</span>
            <span class="pill">❓ 45+ Preguntas</span>
            <span class="pill">🎮 2 Arcade</span>
            <span class="pill">🇨🇷 100% Tico</span>
          </div>
        </div>

        <!-- Columna derecha: cards flotantes -->
        <div class="col-cards" aria-hidden="true">
          <div class="ring"></div>
          <div class="ring ring2"></div>
          <div
            v-for="(c, i) in quizCards"
            :key="c.title"
            class="float-card"
            :style="`--rot:${c.rotate};--delay:${i*0.15}s;top:${c.top};left:${c.left};border-color:${c.color}`"
          >
            <span class="fc-emoji">{{ c.emoji }}</span>
            <span class="fc-title">{{ c.title }}</span>
            <span class="fc-dot" :style="`background:${c.color}`"></span>
          </div>
        </div>

      </div>
    </section>

    <!-- ══ BENTO FEATURES ════════════════════════════════════ -->
    <section class="bento">
      <div class="bento-head">
        <h2>Cuatro formas de <em>demostrar</em> que sos tico</h2>
        <router-link to="/quizzes" class="see-all">Ver todos →</router-link>
      </div>

      <div class="bento-grid">
        <router-link to="/quizzes/sobrevive" class="bcard bcard--large">
          <div class="bcard-bg" style="background-image:url('/imagenes/sobrevive_costa_rica.png')"></div>
          <div class="bcard-overlay" style="--c:#22c55e"></div>
          <div class="bcard-body">
            <span class="bcard-tag" style="background:#22c55e">Aventura</span>
            <h3>Sobrevive en Costa Rica</h3>
            <p>Toma decisiones críticas en la selva tica. ¿Tenés los reflejos para salir vivo?</p>
            <span class="bcard-cta">Jugar ahora →</span>
          </div>
        </router-link>

        <router-link to="/quizzes/donde-estoy" class="bcard">
          <div class="bcard-bg" style="background-image:url('/imagenes/donde_estoy.png')"></div>
          <div class="bcard-overlay" style="--c:#0ea5e9"></div>
          <div class="bcard-body">
            <span class="bcard-tag" style="background:#0ea5e9">Geografía</span>
            <h3>¿Dónde estoy?</h3>
            <p>Adivina el rincón del país con pistas visuales.</p>
            <span class="bcard-cta">Jugar ahora →</span>
          </div>
        </router-link>

        <router-link to="/quizzes/habla-tico" class="bcard">
          <div class="bcard-bg" style="background-image:url('/imagenes/habla_como_tico.png')"></div>
          <div class="bcard-overlay" style="--c:#f59e0b"></div>
          <div class="bcard-body">
            <span class="bcard-tag" style="background:#f59e0b">Cultura</span>
            <h3>Habla como Tico</h3>
            <p>¿Entendés el tuanis de la calle?</p>
            <span class="bcard-cta">Jugar ahora →</span>
          </div>
        </router-link>

        <router-link to="/quizzes/verdadero-falso" class="bcard">
          <div class="bcard-bg" style="background-image:url('/imagenes/verdadero_falso.png')"></div>
          <div class="bcard-overlay" style="--c:#a855f7"></div>
          <div class="bcard-body">
            <span class="bcard-tag" style="background:#a855f7">Trivia</span>
            <h3>Verdadero o Falso</h3>
            <p>Mitos y verdades de nuestro país.</p>
            <span class="bcard-cta">Jugar ahora →</span>
          </div>
        </router-link>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ─── BASE ─────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
.home { font-family: 'Nunito', sans-serif; }
a { text-decoration: none; color: inherit; }

/* ═══════════════════════════════════════════
   FULL-BLEED: rompe el container de App.vue
   (App.vue tiene max-width:1200px y padding:1rem)
   Usamos márgenes negativos + width 100vw para salir.
   ═══════════════════════════════════════════ */
.hero {
  /* Estos valores deben compensar exactamente el padding (1rem) del main-content */
  margin-left:  calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
  /* Altura mínima de toda la pantalla menos el navbar */
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* ── Océano integrado: parte del hero, no fixed ── */
.hero-ocean {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 45%;
  z-index: 0;
  pointer-events: none;
}
.ocean-img {
  width: 200%; height: 100%;
  background: url('/imagenes/real-ocean.jpg') center bottom / cover repeat-x;
  /* Fade arriba para que se mezcle con el gradiente oscuro */
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.5) 40%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.5) 40%, black 100%);
  opacity: .75;
  animation: pan 40s linear infinite;
}
@keyframes pan { from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* ── Gradiente oscuro encima del océano ── */
.hero-bg {
  position: absolute;
  inset: 0;
  /* Fondo: oscuro arriba → casi transparente abajo (deja ver el mar) */
  background: linear-gradient(
    180deg,
    #040d06 0%,
    #071a0c 35%,
    #071a0c 55%,
    rgba(4,10,6,.6) 80%,
    rgba(4,10,6,.1) 100%
  );
  z-index: 1;
}

/* Malla de puntos decorativa */
.mesh {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(34,197,94,.1) 1px, transparent 1px);
  background-size: 30px 30px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 10%, transparent 100%);
}

/* Orbs de luz */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: drift 12s ease-in-out infinite alternate;
}
.o1 { width:700px;height:700px;background:radial-gradient(#15803d,transparent);top:-250px;left:-200px;opacity:.28; }
.o2 { width:450px;height:450px;background:radial-gradient(#0284c7,transparent);top:-80px;right:-80px;opacity:.18;animation-delay:-5s;animation-duration:15s; }
.o3 { width:300px;height:300px;background:radial-gradient(#7c3aed,transparent);top:30%;left:42%;opacity:.14;animation-delay:-8s;animation-duration:9s; }
@keyframes drift { from{transform:translate(0,0) scale(1)} to{transform:translate(30px,20px) scale(1.1)} }

/* Las hojas y lianas las maneja NatureOverlay globalmente — no duplicar aquí */

/* ── Layout interno del hero ── */
.hero-inner {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 5rem 4vw;
  gap: 2rem;
  min-height: calc(100vh - 80px);
}

/* ── Columna texto ── */
.col-text {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity .9s ease, transform .9s ease;
}
.loaded .col-text { opacity:1; transform:translateX(0); }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: rgba(34,197,94,.12);
  border: 1px solid rgba(34,197,94,.25);
  color: #4ade80;
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: .4rem 1.1rem;
  border-radius: 999px;
  margin-bottom: 1.8rem;
}
.dot { width:6px;height:6px;background:#22c55e;border-radius:50%;animation:blink 2s ease-in-out infinite; }
@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}

.headline {
  display: flex;
  flex-direction: column;
  font-size: clamp(3rem, 5.2vw, 5.2rem);
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -3px;
  margin: 0 0 1.5rem;
}
.line1, .line2 { color: #f1f5f9; }
.line3 {
  background: linear-gradient(90deg, #22c55e, #4ade80 40%, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200%;
  animation: shine 5s ease-in-out infinite alternate;
}
@keyframes shine{from{background-position:0%}to{background-position:100%}}

.tagline {
  font-size: clamp(.95rem, 1.4vw, 1.1rem);
  color: rgba(241,245,249,.55);
  line-height: 1.7;
  margin: 0 0 2.2rem;
  max-width: 460px;
}

.actions { display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2rem; }

.cta-main {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 1rem;
  font-weight: 900;
  padding: .95rem 2rem;
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(34,197,94,.4);
  transition: transform .3s ease, box-shadow .3s ease;
}
.cta-main:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 16px 40px rgba(34,197,94,.5); }

.cta-sec {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.14);
  color: rgba(241,245,249,.8);
  font-size: 1rem;
  font-weight: 800;
  padding: .95rem 1.8rem;
  border-radius: 14px;
  backdrop-filter: blur(10px);
  transition: all .3s ease;
}
.cta-sec:hover { background:rgba(255,255,255,.13);color:#fff;transform:translateY(-3px); }

.pill-row { display:flex;flex-wrap:wrap;gap:.6rem; }
.pill {
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1);
  color: rgba(241,245,249,.6);
  font-size: .78rem;
  font-weight: 700;
  padding: .35rem .9rem;
  border-radius: 999px;
}

/* ── Columna cards flotantes ── */
.col-cards {
  position: relative;
  height: 420px;
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 1s ease .2s, transform 1s ease .2s;
}
.loaded .col-cards { opacity:1; transform:translateX(0); }

.ring {
  position: absolute;
  top:50%;left:50%;
  transform: translate(-50%,-50%);
  width:300px;height:300px;
  border-radius:50%;
  border:1px solid rgba(34,197,94,.1);
  animation:ringPulse 4s ease-in-out infinite;
}
.ring2 { width:440px;height:440px;border-color:rgba(34,197,94,.06);animation-delay:-2s; }
@keyframes ringPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}50%{transform:translate(-50%,-50%) scale(1.05);opacity:1}}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: .7rem;
  background: rgba(10,18,30,.8);
  border: 1px solid;
  border-radius: 14px;
  padding: .85rem 1.2rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 40px rgba(0,0,0,.5);
  transform: rotate(var(--rot));
  white-space: nowrap;
  animation: floatAnim 6s ease-in-out infinite alternate;
  animation-delay: var(--delay);
  transition: transform .3s ease;
}
.float-card:hover { transform:rotate(0deg) scale(1.07); }
@keyframes floatAnim{from{transform:rotate(var(--rot)) translateY(0)}to{transform:rotate(var(--rot)) translateY(-14px)}}

.fc-emoji { font-size:1.5rem; }
.fc-title { font-size:.88rem;font-weight:800;color:#f1f5f9; }
.fc-dot { width:7px;height:7px;border-radius:50%;flex-shrink:0; }

/* ═══════════════════════════════════════════
   BENTO
   ═══════════════════════════════════════════ */
.bento {
  padding: 5rem 0 4rem;
  max-width: 1240px;
  margin: 0 auto;
}

.bento-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.bento-head h2 {
  font-size: clamp(1.5rem, 3vw, 2.3rem);
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -1px;
  margin: 0;
}
.bento-head h2 em { font-style:normal;color:#16a34a; }
.see-all {
  font-size: .88rem;font-weight:800;color:#16a34a;
  border:2px solid #16a34a;padding:.5rem 1.2rem;border-radius:999px;
  transition:all .25s ease;
}
.see-all:hover { background:#16a34a;color:#fff; }

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 1.2rem;
}
.bcard--large { grid-column:1;grid-row:1/3; }

.bcard {
  position:relative;border-radius:20px;overflow:hidden;cursor:pointer;
  min-height:210px;display:flex;flex-direction:column;
  transition:transform .35s ease,box-shadow .35s ease;
  box-shadow:0 4px 20px rgba(0,0,0,.07);
}
.bcard:hover { transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,.14); }
.bcard--large { min-height:440px; }

.bcard-bg {
  position:absolute;inset:0;background-size:cover;background-position:center;
  transition:transform .6s ease;
}
.bcard:hover .bcard-bg { transform:scale(1.06); }

.bcard-overlay {
  position:absolute;inset:0;
  background:linear-gradient(to top,color-mix(in srgb,var(--c) 75%,#000) 0%,rgba(0,0,0,.25) 60%,rgba(0,0,0,.05) 100%);
}

.bcard-body {
  position:relative;z-index:2;margin-top:auto;padding:1.4rem;
  color:#fff;display:flex;flex-direction:column;gap:.45rem;
}
.bcard--large .bcard-body { padding:2rem; }

.bcard-tag {
  display:inline-block;font-size:.68rem;font-weight:900;letter-spacing:.06em;
  text-transform:uppercase;padding:.25rem .7rem;border-radius:999px;
  width:fit-content;color:#fff;
}

.bcard-body h3 { font-size:1.2rem;font-weight:900;margin:0;line-height:1.2; }
.bcard--large .bcard-body h3 { font-size:1.6rem; }

.bcard-body p { font-size:.86rem;color:rgba(255,255,255,.72);margin:0;line-height:1.5; }

.bcard-cta {
  font-size:.8rem;font-weight:800;color:rgba(255,255,255,.55);
  letter-spacing:.04em;margin-top:.3rem;
  transition:color .25s,letter-spacing .25s;
}
.bcard:hover .bcard-cta { color:#fff;letter-spacing:.1em; }

/* ─── RESPONSIVE ─────────────────────────── */
@media (max-width: 900px) {
  .hero-inner { grid-template-columns:1fr;padding:4rem 1.5rem 3rem;min-height:auto; }
  .col-cards { display:none; }
  .bento-grid { grid-template-columns:1fr 1fr; }
  .bcard--large { grid-column:1/3;grid-row:auto;min-height:260px; }
}
@media (max-width: 560px) {
  .headline { letter-spacing:-2px; }
  .bento-grid { grid-template-columns:1fr; }
  .bcard--large { grid-column:1; }
  .actions { flex-direction:column; }
  .cta-main,.cta-sec { text-align:center;justify-content:center; }
}
</style>
