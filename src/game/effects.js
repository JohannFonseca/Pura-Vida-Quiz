/**
 * Sistema de efectos visuales y feedback
 */

export const createParticles = (x, y, color, count = 8) => {
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 400,
      vy: (Math.random() - 0.5) * 400 - 100,
      life: 0.5 + Math.random() * 0.5,
      r: 2 + Math.random() * 4,
      color
    })
  }
  return particles
}

export const updateParticles = (particles, dt) => {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vy += 1000 * dt // gravedad partículas
    p.life -= dt
    if (p.life <= 0) particles.splice(i, 1)
  }
}

export const drawFlash = (ctx, CW, CH, intensity) => {
  if (intensity <= 0) return
  ctx.save()
  ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`
  ctx.fillRect(0, 0, CW, CH)
  ctx.restore()
}
