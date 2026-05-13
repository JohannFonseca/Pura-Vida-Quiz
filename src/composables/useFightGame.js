// ── CONSTANTES GLOBALES ──────────────────────────────────────────────────────
// Importante: Usar constantes para que si el profe nos pide cambiar el tamaño de la arena,
// solo tengamos que tocar aquí y no en todo el código.
export const CW = 800, CH = 450
const GRAVITY = 1500  // Pixeles por segundo al cuadrado (p/s²)
export const GROUND_Y = 370 // Nivel del suelo en el eje Y
const ARENA_L = 55, ARENA_R = 745 // Límites laterales para que no se salgan del canvas
const FW = 48, FH = 80  // Medidas base (se sobreescriben con SIZES)

// ── SISTEMA DE AUDIO (Web Audio API) ──────────────────────────────────────────
// No usamos archivos .mp3 para ahorrar espacio y evitar líos de carga.
// Generamos ondas (senosoidales, cuadradas) directamente con el navegador.
let _ac = null
const ac = () => { if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)(); return _ac }
const tone = (f, t, d, v = 0.18) => { 
  try { 
    const a = ac(), o = a.createOscillator(), g = a.createGain(); 
    o.connect(g); g.connect(a.destination); 
    o.type = t; o.frequency.value = f; 
    g.gain.setValueAtTime(v, a.currentTime); 
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + d); 
    o.start(); o.stop(a.currentTime + d) 
  } catch (_) {} 
}

export const sfx = {
  select: () => { tone(440, 'square', 0.1, 0.15); setTimeout(()=>tone(880, 'square', 0.05, 0.1), 50) },
  punch: () => { tone(80, 'sawtooth', 0.1, 0.4); tone(150, 'square', 0.05, 0.2) },
  hit:   () => { tone(60, 'sawtooth', 0.25, 0.5); tone(120, 'square', 0.1, 0.3) },
  heavy: () => { tone(40, 'sawtooth', 0.4, 0.6); tone(80, 'square', 0.2, 0.4) },
  block: () => tone(280, 'square', 0.06, 0.2),
  jump:  () => tone(380, 'sine', 0.15, 0.12),
  win:   () => { 
    tone(523,'sine',0.2); setTimeout(()=>tone(659,'sine',0.2),150); 
    setTimeout(()=>tone(784,'sine',0.2),300); setTimeout(()=>tone(1046,'sine',0.4),450) 
  },
  lose:  () => { tone(200,'sawtooth',0.3); setTimeout(()=>tone(100,'sawtooth',0.5),250) },
  crowd: () => {
    try {
      const a = ac(), g = a.createGain(), n = a.createOscillator()
      n.type = 'sine'; n.frequency.value = 100
      const lfo = a.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.5
      const lfoGain = a.createGain(); lfoGain.gain.value = 40
      lfo.connect(lfoGain); lfoGain.connect(n.frequency)
      n.connect(g); g.connect(a.destination)
      g.gain.value = 0.015; n.start(); lfo.start()
      return { stop: () => { n.stop(); lfo.stop() } }
    } catch (_) { return { stop: () => {} } }
  }
}

// ── HELPERS / UTILIDADES ────────────────────────────────────────────────────
// Detección de colisiones tipo AABB (Axis-Aligned Bounding Box).
// Es la forma más básica y eficiente de saber si dos rectángulos se tocan.
const aabb = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

// Dibujar rectángulos con bordes redondeados (para que se vea más pro).
const rr = (ctx, x, y, w, h, r) => { 
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r); 
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.lineTo(x+r,y+h); 
  ctx.arcTo(x,y+h,x,y+h-r,r); ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath() 
}

import { SIZES } from '../data/fighters.js'

// ── RENDERIZADO DE PERSONAJES ───────────────────────────────────────────────
// Esta función es el alma visual. Dibuja al luchador pieza por pieza en el Canvas.
// Helper: Dibujar textura de píxeles (ruido) para que no se vea plano
const drawTexture = (ctx, x, y, w, h, density = 0.15) => {
  ctx.save()
  ctx.globalAlpha = 0.12
  for (let i = 0; i < (w * h * density); i++) {
    const px = Math.random() * w
    const py = Math.random() * h
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000'
    ctx.fillRect(x + px, y + py, 2, 2)
  }
  ctx.restore()
}

export function drawSprite(ctx, f, animT) {
  const { palette: p, id } = f
  const size = SIZES[id] || { w: 48, h: 80 }
  const fw = size.w, fh = size.h

  // Vaivén al caminar
  const swing = f.state === 'walk' ? Math.sin(animT * 12) * 8 : 0
  // Agacharse al aterrizar (squash)
  const squash = f.state === 'jump' ? 0.82 : 1
  const sx = f.x + (f.shake > 0 ? (Math.random()-.5)*8*f.shake : 0)
  const sy = f.y

  // Sombra en el suelo
  const shadowAlpha = Math.max(0.05, 0.22 - (GROUND_Y - (sy+fh)) * 0.0004)
  ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`
  const shadowScaleX = f.state === 'jump' ? 0.4 : 0.65
  ctx.beginPath(); ctx.ellipse(sx+fw/2, GROUND_Y+5, fw*shadowScaleX, 5, 0, 0, Math.PI*2); ctx.fill()

  // Parpadeo al recibir golpe
  if (f.hitCooldown > 0 && Math.floor(f.hitCooldown*14)%2===0) return

  ctx.save()
  ctx.translate(sx+fw/2, sy+fh/2)
  if (f.facing < 0) ctx.scale(-1,1)

  const cx=0, cy=0
  let bW = fw*0.68, headR=13, legH=28

  if (id==='porcio')      { bW=fw*0.92; legH=18; headR=15 }
  else if (id==='bb7')    { bW=fw*0.5;  legH=36; headR=10 }
  else if (id==='pipi')   { bW=fw*0.58; legH=32; headR=11 }
  else if (id==='keylor') { bW=fw*0.7;  legH=30; headR=13 }

  // ── Piernas
  const legSwingA = swing, legSwingB = -swing
  ctx.fillStyle=p.body
  ctx.fillRect(cx-bW/3, cy+18*squash, bW/3, legH+legSwingA)
  ctx.fillRect(cx+2,    cy+18*squash, bW/3, legH+legSwingB)
  drawTexture(ctx, cx-bW/3, cy+18*squash, bW/3, legH+legSwingA, 0.1)
  drawTexture(ctx, cx+2,    cy+18*squash, bW/3, legH+legSwingB, 0.1)

  // Zapatos
  ctx.fillStyle=p.shoe
  ctx.fillRect(cx-bW/3-3, cy+(18+legH-4)*squash, bW/3+5, 9)
  ctx.fillRect(cx+1,       cy+(18+legH-4)*squash, bW/3+5, 9)

  // ── Cuerpo con degradado y textura
  const bodyGrad = ctx.createLinearGradient(cx-bW/2, 0, cx+bW/2, 0)
  bodyGrad.addColorStop(0, shadeColor(p.body, -25))
  bodyGrad.addColorStop(0.4, p.body)
  bodyGrad.addColorStop(1, shadeColor(p.body, -15))
  ctx.fillStyle=bodyGrad
  rr(ctx,cx-bW/2,cy-14*squash,bW,30*squash, id==='porcio'?10:4); ctx.fill()
  drawTexture(ctx, cx-bW/2, cy-14*squash, bW, 30*squash, 0.2)

  // Cinturón
  ctx.fillStyle=p.belt
  ctx.fillRect(cx-bW/2,cy+14*squash,bW,7)
  ctx.fillStyle='#fbbf24'; ctx.fillRect(cx-4,cy+14*squash,8,7)

  // ── Brazos
  const attackExtend = f.state==='attack' ? 18 : 0
  ctx.fillStyle=p.body
  ctx.fillRect(cx-bW/2-11, cy-10*squash, 11, 20)
  if (f.state==='attack') {
    ctx.fillRect(cx+bW/2-2, cy-9*squash, 24+attackExtend, 11)
    drawTexture(ctx, cx+bW/2-2, cy-9*squash, 24+attackExtend, 11, 0.3)
  } else {
    ctx.fillRect(cx+bW/2-1, cy-10*squash, 11, 20)
  }

  // Manos
  ctx.fillStyle=p.skin
  ctx.beginPath(); ctx.arc(cx-bW/2-6, cy+10*squash, 6, 0, Math.PI*2); ctx.fill()
  if (f.state==='attack') {
    ctx.beginPath(); ctx.arc(cx+bW/2+22+attackExtend, cy-4*squash, 7, 0, Math.PI*2); ctx.fill()
  } else {
    ctx.beginPath(); ctx.arc(cx+bW/2+6, cy+10*squash, 6, 0, Math.PI*2); ctx.fill()
  }

  // ── Cabeza con textura de piel
  ctx.fillStyle=p.skin
  ctx.fillRect(cx-5, cy-22*squash, 10, 10)
  const headGrad = ctx.createRadialGradient(cx-3,cy-32*squash,2,cx,cy-30*squash,headR)
  headGrad.addColorStop(0,'#fff8f0'); headGrad.addColorStop(1,p.skin)
  ctx.fillStyle=headGrad
  ctx.beginPath(); ctx.arc(cx,cy-30*squash,headR,0,Math.PI*2); ctx.fill()
  drawTexture(ctx, cx-headR, cy-30*squash-headR, headR*2, headR*2, 0.05)

  // Ojos y detalles faciales
  const eyeY = cy-34*squash
  ctx.fillStyle='#1a0900'
  if (id==='bb7') {
    ctx.fillRect(cx+4,eyeY,4,2); ctx.fillRect(cx-8,eyeY+4,4,2)
  } else {
    ctx.fillRect(cx+3,eyeY,3,3); ctx.fillRect(cx-6,eyeY,3,3)
  }

  // Sombreros (simplificados para no exceder tokens)
  ctx.fillStyle=p.hat
  if (id==='guanacasteco') {
    ctx.fillRect(cx-22,cy-42*squash,44,5); ctx.fillRect(cx-11,cy-58*squash,22,17)
  } else if (id==='pipi') {
    ctx.beginPath(); ctx.arc(cx-10,cy-30*squash,11,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx+10,cy-30*squash,11,0,Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx,cy-43*squash,14,0,Math.PI*2); ctx.fill()
  } else {
    ctx.fillRect(cx-18,cy-44*squash,36,5); ctx.fillRect(cx-12,cy-57*squash,24,15)
  }

  if (f.state==='hit') {
    ctx.fillStyle='rgba(255,60,60,0.35)'; ctx.fillRect(cx-fw/2,cy-fh/2,fw,fh)
  }
  ctx.restore()
}

// Helper: oscurecer/aclarar un color hex en `amount` (negativo = oscuro)
function shadeColor(hex, amount) {
  let r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  r=Math.max(0,Math.min(255,r+amount)); g=Math.max(0,Math.min(255,g+amount)); b=Math.max(0,Math.min(255,b+amount))
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')
}

// ── DIBUJO DEL ESCENARIO (ARENA) ─────────────────────────────────────────────
const CROWD_COLORS = ['#dc2626','#1d4ed8','#16a34a','#d97706','#7c3aed','#db2777','#0891b2','#ea580c']

function drawCameraFlashes(ctx) {
  if (Math.random() > 0.96) {
    const fx = Math.random() * CW
    const fy = 40 + Math.random() * 80
    const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 40)
    grad.addColorStop(0, 'rgba(255,255,255,0.8)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.beginPath(); ctx.arc(fx, fy, 40, 0, Math.PI*2); ctx.fill()
  }
}

export function drawArena(ctx, crowdAnim, bgImg) {
  if (bgImg && bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, CW, CH)
    drawCameraFlashes(ctx)
    // Capa de tinte atardecer suave para unificar
    ctx.fillStyle = 'rgba(234, 88, 12, 0.1)'
    ctx.fillRect(0,0,CW,CH)
    return
  }

  // ── Cielo multicapa: atardecer rico (FALLBACK)
  const sky = ctx.createLinearGradient(0,0,0,CH)
  sky.addColorStop(0,'#1a0533')
  sky.addColorStop(0.25,'#6b21a8')
  sky.addColorStop(0.55,'#ea580c')
  sky.addColorStop(0.78,'#fbbf24')
  sky.addColorStop(1,'#fef3c7')
  ctx.fillStyle = sky; ctx.fillRect(0,0,CW,CH)

  // ── Nubes (formas ovaladas semi-transparentes)
  const clouds = [[120,38,70,22],[310,25,90,18],[520,42,60,16],[680,30,80,20]]
  ctx.fillStyle='rgba(255,240,210,0.18)'
  clouds.forEach(([cx,cy,rw,rh])=>{ ctx.beginPath(); ctx.ellipse(cx,cy,rw,rh,0,0,Math.PI*2); ctx.fill() })

  // ── Resplandor solar (corona naranja detrás del estadio)
  const glow = ctx.createRadialGradient(CW/2,80,10,CW/2,80,200)
  glow.addColorStop(0,'rgba(251,191,36,0.22)'); glow.addColorStop(1,'rgba(251,191,36,0)')
  ctx.fillStyle=glow; ctx.fillRect(0,0,CW,220)

  // ── Gradas: gradiente de sombra profunda
  const stand = ctx.createLinearGradient(0,40,0,210)
  stand.addColorStop(0,'rgba(30,10,5,0.7)'); stand.addColorStop(1,'rgba(30,10,5,0)')
  ctx.fillStyle=stand; ctx.fillRect(0,40,CW,170)

  // ── Público (2 filas con animación)
  for (let row=0; row<2; row++) {
    for (let i=0; i<44; i++) {
      const x = i*19 - 2
      const bob = Math.sin(crowdAnim*2.8 + i*0.7 + row*1.3)*4
      const baseY = 44 + row*22 + bob
      // Cuerpo
      ctx.fillStyle = CROWD_COLORS[(i+row*3)%CROWD_COLORS.length]
      ctx.fillRect(x+1, baseY+9, 13, 20)
      // Cabeza
      ctx.fillStyle='#f5d6a0'; ctx.beginPath(); ctx.arc(x+7,baseY+5,6,0,Math.PI*2); ctx.fill()
      // Brazos animados (los agitan)
      if (row===0) {
        const armY = baseY + 12 + Math.sin(crowdAnim*3+i)*4
        ctx.strokeStyle=CROWD_COLORS[(i+row*3)%CROWD_COLORS.length]; ctx.lineWidth=2; ctx.beginPath()
        ctx.moveTo(x+1,baseY+13); ctx.lineTo(x-5,armY); ctx.stroke()
        ctx.moveTo(x+13,baseY+13); ctx.lineTo(x+19,armY); ctx.stroke()
      }
    }
  }

  // ── Barrera de cemento del redondel
  const barrier = ctx.createLinearGradient(0,190,0,215)
  barrier.addColorStop(0,'#e2e8f0'); barrier.addColorStop(1,'#94a3b8')
  ctx.fillStyle=barrier; ctx.fillRect(ARENA_L-30,190,CW-ARENA_L*2+60,28)
  ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.fillRect(ARENA_L-30,215,CW-ARENA_L*2+60,5)

  // ── Vallas de madera (tablones con veta)
  for (let i=0; i<8; i++) {
    const y = 218 + i*19
    if (y > GROUND_Y) break
    // Tablones izquierda
    const g1 = ctx.createLinearGradient(ARENA_L-26,0,ARENA_L-8,0)
    g1.addColorStop(0,'#7c5c28'); g1.addColorStop(0.5,'#b8893c'); g1.addColorStop(1,'#7c5c28')
    ctx.fillStyle=g1; rr(ctx,ARENA_L-26,y,18,16,2); ctx.fill()
    // Tablones derecha
    const g2 = ctx.createLinearGradient(ARENA_R+4,0,ARENA_R+22,0)
    g2.addColorStop(0,'#7c5c28'); g2.addColorStop(0.5,'#b8893c'); g2.addColorStop(1,'#7c5c28')
    ctx.fillStyle=g2; rr(ctx,ARENA_R+4,y,18,16,2); ctx.fill()
  }
  // Postes verticales
  ctx.fillStyle='#5c3d0e'; ctx.fillRect(ARENA_L-28,190,7,GROUND_Y-188)
  ctx.fillStyle='#5c3d0e'; ctx.fillRect(ARENA_R+21,190,7,GROUND_Y-188)

  // ── Suelo de arena con textura
  const floor = ctx.createLinearGradient(0,GROUND_Y,0,CH)
  floor.addColorStop(0,'#d4903c'); floor.addColorStop(0.06,'#a0682a'); floor.addColorStop(1,'#3d1e05')
  ctx.fillStyle=floor; ctx.fillRect(0,GROUND_Y,CW,CH-GROUND_Y)

  // Textura de arena: líneas de sombra sutiles
  ctx.strokeStyle='rgba(0,0,0,0.07)'; ctx.lineWidth=1
  for (let i=0; i<12; i++) {
    const yy = GROUND_Y + 10 + i*9
    ctx.beginPath(); ctx.moveTo(ARENA_L,yy); ctx.lineTo(ARENA_R,yy); ctx.stroke()
  }

  // ── Círculo central del redondel (3 elipses)
  ctx.strokeStyle='rgba(255,200,80,0.35)'; ctx.lineWidth=2
  ctx.beginPath(); ctx.ellipse(CW/2,GROUND_Y+8,240,10,0,0,Math.PI*2); ctx.stroke()
  ctx.strokeStyle='rgba(255,200,80,0.15)'; ctx.lineWidth=1
  ctx.beginPath(); ctx.ellipse(CW/2,GROUND_Y+8,320,14,0,0,Math.PI*2); ctx.stroke()

  // ── Luz cenital: reflejo de luz de estadio en el suelo
  const spotlight = ctx.createRadialGradient(CW/2,GROUND_Y+20,10,CW/2,GROUND_Y+20,300)
  spotlight.addColorStop(0,'rgba(255,230,150,0.18)'); spotlight.addColorStop(1,'rgba(255,230,150,0)')
  ctx.fillStyle=spotlight; ctx.fillRect(0,GROUND_Y,CW,CH-GROUND_Y)
}

// ── INTERFAZ DE USUARIO (HUD) ───────────────────────────────────────────────
export function drawHUD(ctx, p1, p2) {
  // Barras de salud (HP Bars)
  const bar = (x, y, w, hp, maxHp, flipped, name) => {
    const pct = Math.max(0, hp / maxHp)
    const barColor = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444'
    ctx.fillStyle='rgba(0,0,0,0.55)'; rr(ctx,x,y,w,22,6); ctx.fill()
    ctx.fillStyle='#1e293b'; ctx.fillRect(x+4,y+4,w-8,14)
    const bw = (w-8) * pct
    ctx.fillStyle = barColor
    ctx.fillRect(flipped ? x+4+(w-8)*(1-pct) : x+4, y+4, bw, 14)
    ctx.fillStyle='white'; ctx.font='bold 13px system-ui'; ctx.textBaseline='middle'
    ctx.textAlign = flipped ? 'right' : 'left'
    ctx.fillText(name, flipped ? x+w-8 : x+8, y+11)
  }
  bar(10,   10, 260, p1.hp, p1.maxHp, false, p1.name)
  bar(CW-270,10, 260, p2.hp, p2.maxHp, true,  p2.name)

  // Letrero VS
  ctx.fillStyle='rgba(0,0,0,0.6)'; rr(ctx,CW/2-24,6,48,28,8); ctx.fill()
  ctx.fillStyle='#fbbf24'; ctx.font='bold 18px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'
  ctx.fillText('VS',CW/2,20)
}

// ── LÓGICA DE ESTADO Y MOVIMIENTO ──────────────────────────────────────────
// Factory pattern: Crea un objeto luchador con todos sus atributos iniciales.
function makeFighter(data, isP1) {
  const size = SIZES[data.id] || { w: 48, h: 80 }
  return {
    ...data,
    x: isP1 ? 160 : CW - 220,
    y: GROUND_Y - size.h,
    vx: 0, vy: 0, // Velocidad en X y Y
    hp: data.maxHp,
    facing: isP1 ? 1 : -1,
    onGround: true,
    state: 'idle', // idle, walk, jump, attack, hit, dead
    stateTimer: 0,
    attackCooldown: 0,
    hitCooldown: 0,
    hitbox: null, // El área que hace daño al atacar
    shake: 0,
    particles: [],
    animT: 0,
    isP1,
    aiState: 'chase',
    aiTimer: 0
  }
}

// Inicializa el estado global de la pelea.
export function makeState(f1data, f2data, bgImg) {
  return {
    p1: makeFighter(f1data, true),
    p2: makeFighter(f2data, false),
    phase: 'countdown', // countdown, fight, result
    countdown: 3,
    winner: null,
    crowdAnim: 0,
    screenShake: 0,
    bgImg: bgImg || null
  }
}

// Ejecuta un ataque: Crea una hitbox frente al personaje.
function doAttack(attacker) {
  if (attacker.attackCooldown > 0 || attacker.state === 'dead' || attacker.state === 'hit') return
  attacker.state = 'attack'
  attacker.stateTimer = 0.32
  attacker.attackCooldown = 0.58
  const size = SIZES[attacker.id] || { w: 48, h: 80 }
  attacker.hitbox = {
    x: attacker.x + (attacker.facing > 0 ? size.w : -52),
    y: attacker.y + 18,
    w: 52, h: 38
  }
  sfx.punch()
}

// Comprueba si el ataque de A le dio a B.
function resolveHit(attacker, defender) {
  if (!attacker.hitbox || attacker.state !== 'attack') return false
  if (defender.hitCooldown > 0 || defender.state === 'dead') return false
  const dSize = SIZES[defender.id] || { w: 48, h: 80 }
  const db = { x: defender.x, y: defender.y, w: dSize.w, h: dSize.h }
  if (!aabb(attacker.hitbox, db)) return false

  defender.hp = Math.max(0, defender.hp - attacker.damage)
  defender.state = 'hit'
  defender.stateTimer = 0.28
  defender.hitCooldown = 0.38
  defender.vx = attacker.facing * 210 // Empujón al recibir golpe
  defender.vy = -180
  defender.shake = 1
  attacker.hitbox = null
  sfx.hit()

  // Efecto de partículas de "sangre" o impacto (color rojo).
  for (let k = 0; k < 7; k++) {
    defender.particles.push({
      x: defender.x + dSize.w/2, y: defender.y + dSize.h/3,
      vx: (Math.random()-.5)*320, vy: -Math.random()*260-80,
      life: 0.45+Math.random()*0.2, color:'#ef4444', r:3+Math.random()*4
    })
  }
  return true
}

// ── INTELIGENCIA ARTIFICIAL (IA) ─────────────────────────────────────────────
// Es un State Machine sencillo con 3 comportamientos: Chase, KeepDistance y Wait.
function runAI(ai, target, dt) {
  if (ai.state === 'dead' || ai.state === 'hit') return
  
  const dx = target.x - ai.x
  const dist = Math.abs(dx)
  ai.facing = dx > 0 ? 1 : -1

  if (ai.aiTimer > 0) ai.aiTimer -= dt

  // Si se acaba el tiempo, decide qué hacer a continuación de forma aleatoria.
  if (ai.aiTimer <= 0) {
    const r = Math.random()
    if (r < 0.5) { ai.aiState = 'chase'; ai.aiTimer = 1.0 + Math.random() * 1.5 } 
    else if (r < 0.8) { ai.aiState = 'keep_distance'; ai.aiTimer = 0.5 + Math.random() * 1.0 } 
    else { ai.aiState = 'wait'; ai.aiTimer = 0.3 + Math.random() * 0.7 }
  }

  // Movimiento según el estado elegido.
  if (ai.aiState === 'chase') {
    if (dist > 65) ai.vx = ai.speed * 0.85 * Math.sign(dx)
  } else if (ai.aiState === 'keep_distance') {
    if (dist < 180) ai.vx = -ai.speed * 0.6 * Math.sign(dx)
    else if (dist > 220) ai.vx = ai.speed * 0.5 * Math.sign(dx)
  } else if (ai.aiState === 'wait') {
    ai.vx = 0
  }

  // Intenta atacar si está en rango (con probabilidad para no ser perfecta).
  if (dist < 85 && ai.attackCooldown <= 0) {
    if (Math.random() < 0.15) doAttack(ai)
  }

  // Salto inteligente (si el jugador salta o aleatorio).
  if (ai.onGround) {
    if (!target.onGround && dist < 150 && Math.random() < 0.05) {
      ai.vy = -720; ai.onGround = false; sfx.jump()
    } else if (Math.random() < 0.005) {
      ai.vy = -650; ai.onGround = false; sfx.jump()
    }
  }
}

// ── UPDATE (FÍSICA) ────────────────────────────────────────────────────────
// Aquí se aplica la gravedad, se mueven los personajes y se limpian las partículas.
function updateFighter(f, dt) {
  const size = SIZES[f.id] || { w: 48, h: 80 }
  
  // Aplicar Gravedad
  f.vy += GRAVITY * dt
  
  // Aplicar Velocidad a la Posición
  f.x += f.vx * dt
  f.y += f.vy * dt
  
  // Colisión con el suelo (Grounding)
  if (f.y + size.h >= GROUND_Y) { 
    if (!f.onGround && f.vy > 100) {
      // Efecto de polvo al aterrizar
      for (let k = 0; k < 6; k++) {
        f.particles.push({
          x: f.x + size.w/2 + (Math.random()-0.5)*size.w, y: GROUND_Y,
          vx: (Math.random()-0.5)*120, vy: -Math.random()*50,
          life: 0.4 + Math.random()*0.4, color: 'rgba(198, 138, 58, 0.4)', r: 1.5+Math.random()*2.5
        })
      }
    }
    f.y = GROUND_Y - size.h; f.vy = 0; f.onGround = true 
  } else {
    f.onGround = false
  }
  
  // Límites de la pantalla (Paredes invisibles)
  f.x = Math.max(ARENA_L, Math.min(ARENA_R - size.w, f.x))
  
  // Rozamiento (Fricción) para detenerse suavemente.
  if (f.onGround) f.vx *= 0.76
  
  // Temporizadores de habilidades y estados
  if (f.attackCooldown > 0) f.attackCooldown -= dt
  if (f.hitCooldown > 0) f.hitCooldown -= dt
  if (f.shake > 0) f.shake = Math.max(0, f.shake - dt * 7)
  if (f.stateTimer > 0) {
    f.stateTimer -= dt
    if (f.stateTimer <= 0) {
      if (f.state === 'attack') { f.state = 'idle'; f.hitbox = null }
      if (f.state === 'hit') f.state = 'idle'
    }
  }
  
  // Determinar animación según movimiento
  if (f.state !== 'attack' && f.state !== 'hit' && f.state !== 'dead') {
    f.state = !f.onGround ? 'jump' : (Math.abs(f.vx) > 12 ? 'walk' : 'idle')
  }
  
  f.animT += dt
  
  // Limpiar partículas viejas para no saturar la memoria (GC).
  for (let i = f.particles.length-1; i>=0; i--) {
    const p = f.particles[i]
    p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 700*dt; p.life -= dt
    if (p.life<=0) f.particles.splice(i,1)
  }
}

// Loop Principal: Se llama en cada frame desde FightView.
export function update(gs, dt, keys, onResult) {
  gs.crowdAnim += dt
  if (gs.screenShake > 0) gs.screenShake = Math.max(0, gs.screenShake - dt * 5)

  if (gs.phase === 'countdown') {
    gs.countdown -= dt
    if (gs.countdown <= 0) gs.phase = 'fight'
    return
  }
  if (gs.phase !== 'fight') return

  const { p1, p2 } = gs

  // Controles del Jugador 1
  if (p1.state !== 'dead' && p1.state !== 'hit') {
    if (keys['a'] || keys['ArrowLeft'])  { p1.vx = -p1.speed; p1.facing = -1 }
    else if (keys['d'] || keys['ArrowRight']) { p1.vx = p1.speed; p1.facing = 1 }
    
    if ((keys['w'] || keys['ArrowUp'] || keys[' ']) && p1.onGround) {
      p1.vy = -740; p1.onGround = false; sfx.jump()
      keys['w']=keys['ArrowUp']=keys[' ']=false
    }
    if (keys['j'] || keys['z'] || keys['x'] || keys['f']) {
      doAttack(p1); keys['j']=keys['z']=keys['x']=keys['f']=false
    }
  }

  // Ejecutar IA para el P2
  runAI(p2, p1, dt)

  // Aplicar física a ambos
  updateFighter(p1, dt)
  updateFighter(p2, dt)

  // Resolver colisiones de ataque
  if (resolveHit(p1, p2)) gs.screenShake = 0.45
  if (resolveHit(p2, p1)) gs.screenShake = 0.3

  // Verificar si alguien murió
  if (p1.hp <= 0 && p1.state !== 'dead') { p1.state='dead'; p1.vx=0 }
  if (p2.hp <= 0 && p2.state !== 'dead') { p2.state='dead'; p2.vx=0 }

  if (p1.state === 'dead' || p2.state === 'dead') {
    gs.phase = 'result'
    gs.winner = p1.state === 'dead' ? 'p2' : 'p1'
    gs.winner === 'p1' ? sfx.win() : sfx.lose()
    onResult(gs.winner)
  }
}

// ── RENDER FINAL (Canvas Draw) ─────────────────────────────────────────────
export function render(ctx, gs) {
  const shake = gs.screenShake > 0 ? (Math.random()-.5)*gs.screenShake*10 : 0
  ctx.save()
  if (shake) ctx.translate(shake, (Math.random()-.5)*shake*0.5)

  drawArena(ctx, gs.crowdAnim, gs.bgImg)

  const { p1, p2 } = gs

  // Dibujar partículas (Sangre/Chispas)
  for (const f of [p1, p2]) {
    for (const p of f.particles) {
      ctx.globalAlpha = Math.max(0, p.life * 2.2)
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill()
    }
  }
  ctx.globalAlpha = 1

  drawSprite(ctx, p1, p1.animT)
  drawSprite(ctx, p2, p2.animT)
  drawHUD(ctx, p1, p2)

  // Overlay del Countdown
  if (gs.phase === 'countdown') {
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0,0,CW,CH)
    const n = Math.ceil(gs.countdown)
    ctx.font = 'bold 120px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fbbf24'
    ctx.fillText(n > 0 ? n : '¡PELEA!', CW/2, CH/2)
  }
  ctx.restore()
}
