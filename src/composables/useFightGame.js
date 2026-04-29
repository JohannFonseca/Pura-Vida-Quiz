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
  punch: () => { tone(90, 'sawtooth', 0.08, 0.35); tone(140, 'square', 0.06, 0.2) },
  hit:   () => tone(160, 'sawtooth', 0.18, 0.28),
  jump:  () => tone(420, 'sine', 0.14, 0.1),
  win:   () => { tone(523,'sine',0.18); setTimeout(()=>tone(659,'sine',0.18),200); setTimeout(()=>tone(784,'sine',0.38),400) },
  lose:  () => { tone(300,'sawtooth',0.18); setTimeout(()=>tone(180,'sawtooth',0.32),220) }
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
export function drawSprite(ctx, f, animT) {
  const { palette: p, id } = f
  const size = SIZES[id] || { w: 48, h: 80 }
  const fw = size.w, fh = size.h
  
  // Efecto de "vaivén" al caminar usando una onda Seno.
  const swing = f.state === 'walk' ? Math.sin(animT * 11) * 7 : 0
  const sx = f.x + (f.shake > 0 ? (Math.random() - 0.5) * 7 * f.shake : 0)
  const sy = f.y

  // Sombra proyectada en el suelo.
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.beginPath(); ctx.ellipse(sx + fw/2, GROUND_Y+4, fw*0.6, 5, 0, 0, Math.PI*2); ctx.fill()

  // Si acaba de recibir un golpe, parpadea (efecto visual clásico).
  if (f.hitCooldown > 0 && Math.floor(f.hitCooldown * 12) % 2 === 0) return

  ctx.save()
  ctx.translate(sx + fw/2, sy + fh/2)
  if (f.facing < 0) ctx.scale(-1, 1) // Voltear al personaje si mira a la izquierda
  
  const cx = 0, cy = 0
  const scaleY = f.state === 'jump' ? 0.85 : 1 // Aplastarse un poco al saltar
  
  // Proporciones dinámicas según el personaje (Gordo vs Flaco).
  let bodyW = fw * 0.7
  let headR = 13
  let legH = 28
  
  if (id === 'porcio') { bodyW = fw * 0.9; legH = 20 }
  if (id === 'bb7') { bodyW = fw * 0.5; legH = 35; headR = 10 }

  // Piernas
  ctx.fillStyle = p.body
  ctx.fillRect(cx - bodyW/3, cy + 18 * scaleY, bodyW/3, legH + swing)
  ctx.fillRect(cx + 2,  cy + 18 * scaleY, bodyW/3, legH - swing)

  // Zapatos
  ctx.fillStyle = p.shoe
  ctx.fillRect(cx - bodyW/3 - 2, cy + (18+legH-4) * scaleY, bodyW/3+4, 8)
  ctx.fillRect(cx + 2,  cy + (18+legH-4) * scaleY, bodyW/3+4, 8)

  // Cinturón
  ctx.fillStyle = p.belt
  ctx.fillRect(cx - bodyW/2, cy + 14 * scaleY, bodyW, 6)

  // Cuerpo / Camisa
  ctx.fillStyle = p.body
  rr(ctx, cx - bodyW/2, cy - 14 * scaleY, bodyW, 30 * scaleY, id === 'porcio' ? 10 : 4); ctx.fill()

  // Brazo de ataque (solo si está atacando)
  if (f.state === 'attack') {
    ctx.fillStyle = p.skin
    ctx.fillRect(cx + bodyW/2 - 2, cy - 8 * scaleY, 22, 10)
  }

  // Brazos normales
  ctx.fillStyle = p.body
  ctx.fillRect(cx - bodyW/2 - 10, cy - 10 * scaleY, 11, 20)  // Brazo izq
  ctx.fillRect(cx + bodyW/2 - 1,  cy - 10 * scaleY, 11, 20)  // Brazo der

  // Manos
  ctx.fillStyle = p.skin
  ctx.beginPath(); ctx.arc(cx - bodyW/2 - 5, cy + 10 * scaleY, 5, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx + bodyW/2 + 5, cy + 10 * scaleY, 5, 0, Math.PI*2); ctx.fill()

  // Cuello y Cabeza
  ctx.fillStyle = p.skin
  ctx.fillRect(cx - 5, cy - 22 * scaleY, 10, 10)
  ctx.beginPath(); ctx.arc(cx, cy - 30 * scaleY, headR, 0, Math.PI*2); ctx.fill()

  // Ojos (BB7 los tiene raros/feos por diseño)
  ctx.fillStyle = '#1a0900'
  if (id === 'bb7') {
    ctx.fillRect(cx + 4, cy - 36 * scaleY, 4, 2)
    ctx.fillRect(cx - 8, cy - 32 * scaleY, 4, 2)
  } else {
    ctx.fillRect(cx + 3, cy - 34 * scaleY, 3, 3)
    ctx.fillRect(cx - 6, cy - 34 * scaleY, 3, 3)
  }

  // Sombreros / Pelo (Personalizado por ID)
  ctx.fillStyle = p.hatBrim
  if (id === 'guanacasteco') {
    ctx.fillStyle = p.hatBrim; ctx.fillRect(cx - 20, cy - 42 * scaleY, 40, 5) 
    ctx.fillStyle = p.hat; ctx.fillRect(cx - 10, cy - 58 * scaleY, 20, 16) 
  } else if (id === 'pipi') {
    ctx.fillStyle = p.hat
    ctx.beginPath(); ctx.arc(cx - 10, cy - 30 * scaleY, 10, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + 10, cy - 30 * scaleY, 10, 0, Math.PI*2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx, cy - 42 * scaleY, 14, 0, Math.PI*2); ctx.fill()
    ctx.fillStyle = '#ff69b4'; ctx.fillRect(cx - 6, cy - 54 * scaleY, 12, 6)
  } else if (id === 'keylor') {
    ctx.fillStyle = p.hat; rr(ctx, cx - 14, cy - 48 * scaleY, 28, 12, 8); ctx.fill()
  } else if (id === 'porcio') {
    ctx.fillStyle = p.hat; ctx.fillRect(cx - 18, cy - 42 * scaleY, 36, 4); ctx.fillRect(cx - 12, cy - 50 * scaleY, 24, 10)
  } else {
    ctx.fillStyle = p.hatBrim; ctx.fillRect(cx - 16, cy - 44 * scaleY, 32, 5)
    ctx.fillStyle = p.hat; rr(ctx, cx - 12, cy - 55 * scaleY, 24, 14, 6); ctx.fill()
  }

  // Flash rojo al ser golpeado.
  if (f.state === 'hit') {
    ctx.fillStyle = 'rgba(255,50,50,0.4)'; ctx.fillRect(cx - fw/2, cy - fh/2, fw, fh)
  }
  ctx.restore()
}

// ── DIBUJO DEL ESCENARIO (ARENA) ─────────────────────────────────────────────
// Redondel de toros con degradados y público animado.
const CROWD_COLORS = ['#dc2626','#1d4ed8','#16a34a','#d97706','#7c3aed','#db2777','#0891b2','#ea580c']

export function drawArena(ctx, crowdAnim) {
  // Cielo (Degradado Lineal)
  const sky = ctx.createLinearGradient(0,0,0,CH)
  sky.addColorStop(0,'#5BA3C9'); sky.addColorStop(0.45,'#F4C882'); sky.addColorStop(1,'#E8A96A')
  ctx.fillStyle = sky; ctx.fillRect(0,0,CW,CH)

  // Público (Filas traseras) - Usamos Math.sin para que "salten".
  for (let i = 0; i < 42; i++) {
    const x = i * 20 - 4
    const bob = Math.sin(crowdAnim * 2.5 + i * 0.8) * 3
    ctx.fillStyle = CROWD_COLORS[i % CROWD_COLORS.length]
    ctx.fillRect(x, 55 + bob, 15, 26)
    ctx.fillStyle = '#F4C882'; ctx.beginPath(); ctx.arc(x + 7, 50 + bob, 7, 0, Math.PI*2); ctx.fill()
  }

  // Gradas (Sombras)
  const stand = ctx.createLinearGradient(0,70,0,200)
  stand.addColorStop(0,'rgba(80,50,20,0.85)'); stand.addColorStop(1,'rgba(80,50,20,0)')
  ctx.fillStyle = stand; ctx.fillRect(0,70,CW,160)

  // Vallas de madera (Tablas)
  for (let y = 215; y < GROUND_Y; y += 38) {
    ctx.fillStyle = '#9B7035'; rr(ctx, ARENA_L-22, y, 18, 32, 3); ctx.fill()
    ctx.strokeStyle='#6B4A1A'; ctx.lineWidth=1; ctx.stroke()
    ctx.fillStyle = '#9B7035'; rr(ctx, ARENA_R+4, y, 18, 32, 3); ctx.fill()
    ctx.strokeStyle='#6B4A1A'; ctx.lineWidth=1; ctx.stroke()
  }
  ctx.fillStyle='#6B4A1A'; ctx.fillRect(ARENA_L-26, 210, 6, GROUND_Y-208)
  ctx.fillStyle='#6B4A1A'; ctx.fillRect(ARENA_R+20, 210, 6, GROUND_Y-208)

  // Suelo de arena
  const floor = ctx.createLinearGradient(0,GROUND_Y,0,CH)
  floor.addColorStop(0,'#C68A3A'); floor.addColorStop(0.08,'#8B5E1E'); floor.addColorStop(1,'#3D2008')
  ctx.fillStyle = floor; ctx.fillRect(0,GROUND_Y,CW,CH-GROUND_Y)

  // Círculo central (Marca del redondel)
  ctx.strokeStyle='rgba(255,210,110,0.22)'; ctx.lineWidth=2
  ctx.beginPath(); ctx.ellipse(CW/2,GROUND_Y+6,260,11,0,0,Math.PI*2); ctx.stroke()
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
export function makeState(f1data, f2data) {
  return {
    p1: makeFighter(f1data, true),
    p2: makeFighter(f2data, false),
    phase: 'countdown', // countdown, fight, result
    countdown: 3,
    winner: null,
    crowdAnim: 0,
    screenShake: 0,
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

  drawArena(ctx, gs.crowdAnim)

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
