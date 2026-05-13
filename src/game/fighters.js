import { STATES, GROUND_Y, CW } from './constants.js'
import { SIZES } from '../data/fighters.js'

export const createFighter = (data, isPlayer = true) => {
  const size = SIZES[data.id] || { w: 48, h: 80 }
  
  return {
    ...data,
    isPlayer,
    x: isPlayer ? 100 : CW - 100 - size.w,
    y: GROUND_Y - size.h,
    vx: 0,
    vy: 0,
    width: size.w,
    height: size.h,
    facing: isPlayer ? 1 : -1,
    hp: data.maxHp,
    state: STATES.IDLE,
    stateTimer: 0,
    cooldowns: {
      attack: 0,
      hit: 0,
      block: 0,
    },
    hitbox: null,
    onGround: true,
    comboCount: 0,
    comboTimer: 0,
    inputBuffer: [],
    shake: 0,
    particles: [],
    animT: 0
  }
}

export const updateFighterState = (f, dt, GRAVITY, ARENA_L, ARENA_R) => {
  // Aplicar gravedad
  f.vy += GRAVITY * dt
  f.x += f.vx * dt
  f.y += f.vy * dt

  // Colisión suelo
  let landed = false
  if (f.y + f.height >= GROUND_Y) {
    if (!f.onGround && f.vy > 100) landed = true
    f.y = GROUND_Y - f.height
    f.vy = 0
    f.onGround = true
  } else {
    f.onGround = false
  }

  // Límites arena
  f.x = Math.max(ARENA_L, Math.min(ARENA_R - f.width, f.x))

  // Fricción
  if (f.onGround) {
    f.vx *= 0.8
  }

  // Timers
  if (f.stateTimer > 0) f.stateTimer -= dt
  if (f.cooldowns.attack > 0) f.cooldowns.attack -= dt
  if (f.cooldowns.hit > 0) f.cooldowns.hit -= dt
  if (f.comboTimer > 0) f.comboTimer -= dt
  else f.comboCount = 0

  // Reset de estado
  if (f.stateTimer <= 0 && ![STATES.DEAD, STATES.IDLE, STATES.MOVE, STATES.JUMP, STATES.BLOCK].includes(f.state)) {
    f.state = STATES.IDLE
    f.hitbox = null
  }

  // Actualizar facing basado en movimiento si no está atacando
  if (f.state === STATES.IDLE || f.state === STATES.MOVE || f.state === STATES.JUMP) {
    if (Math.abs(f.vx) > 10) {
      f.state = f.onGround ? STATES.MOVE : STATES.JUMP
    } else {
      f.state = f.onGround ? STATES.IDLE : STATES.JUMP
    }
  }

  f.animT += dt
  return landed
}
