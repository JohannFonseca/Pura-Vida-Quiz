/**
 * Sistema de colisiones y hitboxes
 */

export const aabb = (a, b) => {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

export const checkHit = (attacker, defender) => {
  if (!attacker.hitbox || defender.state === 'dead') return false
  
  // Si el defensor está bloqueando y mirando al atacante
  const isBlocking = defender.state === 'block' && 
                    ((defender.x < attacker.x && defender.facing === 1) || 
                     (defender.x > attacker.x && defender.facing === -1))

  const defenderBox = {
    x: defender.x,
    y: defender.y,
    w: defender.width,
    h: defender.height
  }

  if (aabb(attacker.hitbox, defenderBox)) {
    return {
      hit: true,
      blocked: isBlocking
    }
  }

  return { hit: false }
}
