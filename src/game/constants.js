export const CW = 800
export const CH = 450
export const GROUND_Y = 354  // sprites de 96px: y = 354, pies en 354+96=450... ajustado a arena
export const GRAVITY = 1800
export const ARENA_L = 40
export const ARENA_R = 760

export const STATES = {
  IDLE: 'idle',
  MOVE: 'walk',
  JUMP: 'jump',
  ATTACK_LIGHT: 'attack_light',
  ATTACK_HEAVY: 'attack_heavy',
  BLOCK: 'block',
  HIT: 'hit',
  DEAD: 'dead'
}

export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}
