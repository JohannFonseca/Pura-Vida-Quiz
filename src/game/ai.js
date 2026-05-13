/**
 * IA Inteligente para el oponente
 */
import { STATES, DIFFICULTIES } from './constants.js'

export const runAI = (ai, player, dt, difficulty = DIFFICULTIES.MEDIUM) => {
  if (ai.state === STATES.DEAD || ai.state === STATES.HIT) return

  const dx = player.x - ai.x
  const dist = Math.abs(dx)
  const isPlayerAttacking = [STATES.ATTACK_LIGHT, STATES.ATTACK_HEAVY].includes(player.state)

  // Probabilidades según dificultad
  const config = {
    [DIFFICULTIES.EASY]: {
      reactionTime: 0.8,
      attackProb: 0.02,
      blockProb: 0.1,
      chaseDist: 80
    },
    [DIFFICULTIES.MEDIUM]: {
      reactionTime: 0.4,
      attackProb: 0.05,
      blockProb: 0.4,
      chaseDist: 65
    },
    [DIFFICULTIES.HARD]: {
      reactionTime: 0.1,
      attackProb: 0.12,
      blockProb: 0.8,
      chaseDist: 50
    }
  }[difficulty]

  // Actualizar facing
  if (ai.state !== STATES.BLOCK) {
    ai.facing = dx > 0 ? 1 : -1
  }

  // Lógica de Bloqueo: si el jugador ataca y estamos cerca
  if (isPlayerAttacking && dist < 120) {
    if (Math.random() < config.blockProb) {
      ai.state = STATES.BLOCK
      ai.vx = 0
      return
    }
  } else if (ai.state === STATES.BLOCK) {
    ai.state = STATES.IDLE
  }

  // Lógica de Movimiento
  if (dist > config.chaseDist) {
    ai.vx = ai.speed * 0.8 * Math.sign(dx)
    ai.state = STATES.MOVE
  } else if (dist < config.chaseDist - 20) {
    ai.vx = -ai.speed * 0.5 * Math.sign(dx)
    ai.state = STATES.MOVE
  } else {
    ai.vx = 0
    ai.state = STATES.IDLE
  }

  // Lógica de Ataque
  if (dist < config.chaseDist + 20 && ai.cooldowns.attack <= 0) {
    if (Math.random() < config.attackProb) {
      // Decidir entre ataque ligero o fuerte
      const type = Math.random() > 0.3 ? 'light' : 'heavy'
      return { action: 'attack', type }
    }
  }

  // Salto ocasional
  if (ai.onGround && (player.y < ai.y - 50 || Math.random() < 0.005)) {
    if (Math.random() < 0.1) return { action: 'jump' }
  }

  return null
}
