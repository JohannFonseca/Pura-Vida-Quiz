/**
 * Motor de juego principal (Engine)
 */
import { CW, CH, STATES, GRAVITY, ARENA_L, ARENA_R, GROUND_Y } from './constants.js'
import { createFighter, updateFighterState } from './fighters.js'
import { checkHit } from './collisions.js'
import { runAI } from './ai.js'
import { createParticles, updateParticles } from './effects.js'

export const initGameState = (p1Data, p2Data, difficulty) => {
  const gs = {
    p1: createFighter(p1Data, true),
    p2: createFighter(p2Data, false),
    difficulty,
    timer: 99,
    round: 1,
    roundWins: { p1: 0, p2: 0 },
    maxRounds: 3,
    phase: 'countdown', // countdown, fight, result
    countdown: 3,
    winner: null,
    screenShake: 0,
    hitFlash: 0,
    slowMo: 1,
    hitStop: 0,
    announcement: null, // 'round', 'fight', 'victory'
    particles: []
  }
  // Posiciones iniciales fuera de pantalla para la entrada
  gs.p1.x = -150
  gs.p2.x = CW + 150
  return gs
}

export const processAttack = (attacker, type) => {
  if (attacker.cooldowns.attack > 0 || [STATES.HIT, STATES.DEAD, STATES.BLOCK].includes(attacker.state)) return
  
  // Lógica de combo para ataque ligero (J)
  let isSpecial = false
  if (type === 'light') {
    if (attacker.comboTimer > 0 && attacker.comboCount === 1) {
      isSpecial = true
      attacker.comboCount = 0
      attacker.comboTimer = 0
    } else {
      attacker.comboCount = 1
      attacker.comboTimer = 0.5 // Ventana de medio segundo para el combo
    }
  }

  attacker.state = isSpecial ? STATES.ATTACK_HEAVY : (type === 'light' ? STATES.ATTACK_LIGHT : STATES.ATTACK_HEAVY)
  attacker.stateTimer = isSpecial ? 0.5 : (type === 'light' ? 0.25 : 0.45)
  attacker.cooldowns.attack = isSpecial ? 0.6 : (type === 'light' ? 0.4 : 0.7)
  
  // Hitbox
  attacker.hitbox = {
    x: attacker.x + (attacker.facing > 0 ? attacker.width : -70),
    y: attacker.y + 15,
    w: isSpecial ? 90 : 60,
    h: 50
  }
}

export const updateEngine = (gs, dt, keys, sfx, onResult) => {
  // Hit Stop: congela el juego por un instante al impactar
  if (gs.hitStop > 0) {
    gs.hitStop -= dt
    return
  }

  // Aplicar Slow Motion si es necesario
  const actualDt = dt * gs.slowMo
  
  // Timers globales
  if (gs.phase === 'countdown') {
    gs.countdown -= dt
    
    // Anuncio dinámico
    if (gs.countdown > 1.5) gs.announcement = 'round'
    else if (gs.countdown > 0) gs.announcement = 'fight'
    else gs.announcement = null

    // Entrada: los personajes caminan a sus puestos
    const targetP1 = 150
    const targetP2 = CW - 150 - gs.p2.width
    
    if (gs.p1.x < targetP1) { gs.p1.vx = gs.p1.speed; gs.p1.state = STATES.MOVE }
    else { gs.p1.vx = 0; gs.p1.state = STATES.IDLE }
    
    if (gs.p2.x > targetP2) { gs.p2.vx = -gs.p2.speed; gs.p2.state = STATES.MOVE }
    else { gs.p2.vx = 0; gs.p2.state = STATES.IDLE }

    updateFighterState(gs.p1, dt, GRAVITY, -200, CW + 200)
    updateFighterState(gs.p2, dt, GRAVITY, -200, CW + 200)

    if (gs.countdown <= 0) {
      gs.phase = 'fight'
      gs.announcement = null
      gs.p1.vx = 0; gs.p2.vx = 0
    }
    return
  }

  if (gs.phase !== 'fight') return

  gs.timer -= dt
  if (gs.timer <= 0) {
    gs.timer = 0
    finishGame(gs, gs.p1.hp > gs.p2.hp ? 'p1' : 'p2', sfx, onResult)
    return
  }

  // Update de efectos
  if (gs.screenShake > 0) gs.screenShake -= dt * 5
  if (gs.hitFlash > 0) gs.hitFlash -= dt * 10
  if (gs.slowMo < 1) gs.slowMo += dt * 2
  if (gs.slowMo > 1) gs.slowMo = 1

  const { p1, p2 } = gs

  // Controles P1
  if (p1.state !== STATES.DEAD && p1.state !== STATES.HIT) {
    if (keys['l'] || keys['L']) {
      p1.state = STATES.BLOCK
      p1.vx = 0
    } else {
      if (p1.state === STATES.BLOCK) p1.state = STATES.IDLE
      if (keys['a'] || keys['A'] || keys['ArrowLeft']) { p1.vx = -p1.speed; p1.facing = -1 }
      else if (keys['d'] || keys['D'] || keys['ArrowRight']) { p1.vx = p1.speed; p1.facing = 1 }
      if ((keys['w'] || keys['W'] || keys['ArrowUp'] || keys[' ']) && p1.onGround) {
        p1.vy = -850; p1.onGround = false; sfx.jump()
        delete keys['w']; delete keys['W']; delete keys['ArrowUp']; delete keys[' ']
      }
      if (keys['j'] || keys['J']) { processAttack(p1, 'light'); sfx.punch(); delete keys['j']; delete keys['J'] }
      if (keys['k'] || keys['K']) { processAttack(p1, 'heavy'); sfx.punch(); delete keys['k']; delete keys['K'] }
    }
  }

  // IA P2
  if (p2.state !== STATES.DEAD && p2.state !== STATES.HIT) {
    const aiAction = runAI(p2, p1, actualDt, gs.difficulty)
    if (aiAction) {
      if (aiAction.action === 'attack') { processAttack(p2, aiAction.type); sfx.punch() }
      else if (aiAction.action === 'jump' && p2.onGround) { p2.vy = -800; p2.onGround = false; sfx.jump() }
    }
  }

  // Update física
  const l1 = updateFighterState(p1, actualDt, GRAVITY, ARENA_L, ARENA_R)
  const l2 = updateFighterState(p2, actualDt, GRAVITY, ARENA_L, ARENA_R)
  if (l1 || l2) gs.screenShake = Math.max(gs.screenShake, 0.15)

  // Resolver golpes
  const resolve = (attacker, defender) => {
    if (!attacker.hitbox) return
    const result = checkHit(attacker, defender)
    if (result.hit) {
      const hx = attacker.hitbox.x, hy = attacker.hitbox.y
      if (result.blocked) {
        sfx.block(); attacker.hitbox = null; defender.vx = attacker.facing * 100
        gs.particles.push(...createParticles(hx, hy, '#94a3b8', 4))
      } else {
        const isHeavy = attacker.state === STATES.ATTACK_HEAVY
        const damage = isHeavy ? attacker.damage * 1.5 : attacker.damage
        defender.hp = Math.max(0, defender.hp - damage)
        defender.state = STATES.HIT; defender.stateTimer = 0.3; defender.cooldowns.hit = 0.4
        defender.vx = attacker.facing * (isHeavy ? 400 : 250); defender.vy = -200
        attacker.hitbox = null
        gs.hitStop = isHeavy ? 0.12 : 0.06
        gs.screenShake = isHeavy ? 0.6 : 0.3
        gs.hitFlash = 0.3
        isHeavy ? sfx.heavy() : sfx.hit()
        gs.particles.push(...createParticles(defender.x + defender.width/2, defender.y + defender.height/2, '#ef4444', 10))
        
        if (defender.hp <= 0) finishGame(gs, attacker.isPlayer ? 'p1' : 'p2', sfx, onResult)
      }
    }
  }
  resolve(p1, p2); resolve(p2, p1)

  // Partículas
  updateParticles(gs.particles, actualDt)
}

function finishGame(gs, roundWinner, sfx, onResult) {
  if (gs.phase === 'result') return
  
  // Incrementar victorias de round
  gs.roundWins[roundWinner]++
  
  // ¿Ha ganado la pelea completa? (Mejor de 3)
  const matchOver = gs.roundWins[roundWinner] >= 2
  
  if (matchOver) {
    gs.phase = 'result'
    gs.winner = roundWinner
    gs.announcement = roundWinner === 'p1' ? 'p1_wins' : 'cpu_wins'
    gs.slowMo = 0.2
    roundWinner === 'p1' ? sfx.win() : sfx.lose()
    if (roundWinner === 'p1') gs.p2.state = STATES.DEAD
    else gs.p1.state = STATES.DEAD
    onResult(roundWinner)
  } else {
    // Siguiente round
    gs.phase = 'countdown'
    gs.countdown = 3
    gs.timer = 99
    gs.round++
    gs.announcement = 'round'
    
    // Resetear luchadores
    gs.p1.hp = gs.p1.maxHp; gs.p1.x = -150; gs.p1.state = STATES.IDLE; gs.p1.vx = 0; gs.p1.vy = 0
    gs.p2.hp = gs.p2.maxHp; gs.p2.x = CW + 150; gs.p2.state = STATES.IDLE; gs.p2.vx = 0; gs.p2.vy = 0
    gs.slowMo = 1
  }
}
