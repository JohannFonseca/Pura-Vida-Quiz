export const PIXEL = 4

// ─── PALETAS ─────────────────────────────────────────────────────────────────
export const PALETTES = {
  // KEYLOR NAVAS — uniforme verde portero, cabello rubio/claro, guantes
  keylor: {
    '.':'', 'H':'#f5e6a3','h':'#c9bb70','S':'#fddbb4','s':'#d4aa80',
    'E':'#1a0800','G':'#16a34a','g':'#14532d','L':'#15803d','l':'#166534',
    'P':'#4ade80','B':'#111827','W':'#ffffff','N':'#fddbb4','C':'#86efac',
    'T':'#f0fdf4','D':'#052e16',
  },
  // GUANACASTECO DE SEPA — sombrero blanco, camisa amarilla, jeans, soga
  guanacasteco: {
    '.':'','H':'#f0ead6','h':'#c8bfa8','S':'#8B5E3C','s':'#6b3f22',
    'E':'#1a0800','Y':'#d97706','y':'#b45309','J':'#3b82f6','j':'#1d4ed8',
    'B':'#1c0f05','M':'#1a0800','R':'#f59e0b','r':'#d97706','T':'#fffbf0',
    'W':'#f5f0e0','G':'#d4b896',
  },
  // PIPI DE ESCAZÚ — camisa lila/morada, lentes, cabello gris, piel clara
  pipi: {
    '.':'','H':'#6b7280','h':'#4b5563','S':'#ffe4c4','s':'#ddb99b',
    'E':'#1a0800','G':'#a78bfa','g':'#7c3aed','P':'#374151','B':'#111827',
    'L':'#e9d5ff','W':'#ffffff','N':'#ffe4c4','F':'#9ca3af','T':'#f3f4f6',
    'C':'#ddd6fe',
  },
  // BB7 — camisa roja con rayas, pelo negro, delgado, piel morena clara
  bb7: {
    '.':'','H':'#111827','h':'#1f2937','S':'#c8a050','s':'#a07030',
    'E':'#1a0800','R':'#dc2626','r':'#991b1b','K':'#1a1a1a','P':'#111827',
    'B':'#0a0a0a','W':'#ffffff','N':'#c8a050','T':'#f87171','D':'#7f1d1d',
  },
  // EL PORCIO — traje naranja NASA, cuerpo ancho, pelo negro, bigote
  porcio: {
    '.':'', 'H':'#1f2937', 'h':'#374151', 'S':'#c68642', 's':'#9a5828',
    'E':'#1a0800', 'O':'#ea580c', 'o':'#c2410c', 'M':'#1f2937', 'B':'#111827',
    'W':'#9ca3af', 'N':'#c68642', 'T':'#f97316', 'G':'#6b7280', 'V':'#1d4ed8',
    'Z':'#ffffff',
  },
  // FRANKLIN CHANG — traje espacial plata/azul, pelo negro, casco bajo el brazo o visor
  franklin: {
    '.':'', 'H':'#111827', 'h':'#1f2937', 'S':'#fddbb4', 's':'#d4aa80',
    'E':'#1a0800', 'U':'#94a3b8', 'u':'#475569', 'A':'#cbd5e1', 'a':'#94a3b8',
    'R':'#ef4444', 'B':'#1d4ed8', 'K':'#111827', 'W':'#ffffff', 'O':'#f97316',
  }
}

// ─── SPRITES ─────────────────────────────────────────────────────────────────
// 16 cols × 24 rows × PIXEL(4px) = 64×96 en pantalla

// ══ FRANKLIN CHANG ════════════════════════════════════════════════════════════
const FR_IDLE = [
  '.....HHHHH......',
  '....HHHHHHH.....',
  '....HhHHHHh.....',
  '....SSSSSSS.....',
  '....SEssSES.....',
  '.....SSSSS......',
  '....UUUUUUU.....',
  '...UUUUUUUUU....',
  '..UUUUUUUUUUU...',
  '..UUUURBUUUUU...', // Logo NASA
  '..UUUUUUUUUUU...',
  '...UUUUUUUUU....',
  '...UUUUUUUUU....',
  '...aaaaaaaaa....',
  '...aaaaaaaaa....',
  '..aaaaaaaaaaa...',
  '..aaaaaaaaaaa...',
  '..aaa...aaa.....',
  '..aaa...aaa.....',
  '..aaa...aaa.....',
  '..KKK...KKK.....',
  '..KKK...KKK.....',
  '.KKKK...KKKK....',
  '................',
]
const FR_ATTACK = [
  '.....HHHHH......',
  '....HHHHHHH.....',
  '....HhHHHHh.....',
  '....SSSSSSS.....',
  '....SEssSES.....',
  '.....SSSSS......',
  '....UUUUUUU.....',
  '...UUUUUUUUU....',
  '..UUUUUUUUUUUUUU',
  '..UUUURBUUUUUUUU',
  '..UUUUUUUUUUUUUU',
  '...UUUUUUUUUUUUU',
  '...UUUUUUUUU....',
  '...aaaaaaaaa....',
  '...aaaaaaaaa....',
  '..aaaaaaaaaaa...',
  '..aaaaaaaaaaa...',
  '..aaa...aaa.....',
  '..aaa...aaa.....',
  '..aaa...aaa.....',
  '..KKK...KKK.....',
  '..KKK...KKK.....',
  '.KKKK...KKKK....',
  '................',
]

// ══ KEYLOR NAVAS ══════════════════════════════════════════════════════════════
const K_IDLE = [
  '....HHHHHHH.....',
  '...HHHHHHHHh....',
  '...HhHHHHHhH....',
  '....SSSSSSS.....',
  '....SEssSES.....',
  '.....SSSSSS.....',
  '.....WNNNW......',
  '....GGGGGGGG....',
  '..PPGGGGGGGGPP..',
  '..PPgGGGGGGgPP..',
  '..PPPGGGGGPPP...',
  '....GGCGGGG.....',
  '....GGGGGGG.....',
  '...gGGGGGGg.....',
  '....LLLLLLL.....',
  '...LLLLLLLLL....',
  '....lllllll.....',
  '....TTTTTTT.....',
  '....TTTTTTT.....',
  '....TTTTTTT.....',
  '...BBBBBBBBB....',
  '...BBBBBBBBB....',
  '..BBBBBBBBBBB...',
  '................',
]
const K_ATTACK = [
  '....HHHHHHH.....',
  '...HHHHHHHHh....',
  '...HhHHHHHhH....',
  '....SSSSSSS.....',
  '....SEssSES.....',
  '.....SSSSSS.....',
  '.....WNNNW......',
  '....GGGGGGGG....',
  '..PPGGGGGGGGGGpp',
  '..PPgGGGGGGGGPpp',
  '..PPPGGGGGGGGPpp',
  '....GGGGGGGGgPP.',
  '....GGGGGGG.....',
  '...gGGGGGGg.....',
  '....LLLLLLL.....',
  '...LLLLLLLLL....',
  '....lllllll.....',
  '....TTTTTTT.....',
  '....TTTTTTT.....',
  '....TTTTTTT.....',
  '...BBBBBBBBB....',
  '...BBBBBBBBB....',
  '..BBBBBBBBBBB...',
  '................',
]
const K_HIT = [
  '...HHHHHHH......',
  '..HHHHHHHHh.....',
  '..HhHHHHHhH.....',
  '...SSSSSSS......',
  '...SEssSES......',
  '....SSSSSS......',
  '....WNNNW.......',
  '...GGGGGGGG.....',
  '.PPGGGGGGGGPP...',
  '.PPgGGGGGGgPP...',
  '.PPPGGGGGPPP....',
  '...GGCGGGG......',
  '...GGGGGGG......',
  '..gGGGGGGg......',
  '...LLLLLLL......',
  '..LLLLLLLLL.....',
  '...lllllll......',
  '...TTTTTTT......',
  '...TTTTTTT......',
  '...TTTTTTT......',
  '..BBBBBBBBB.....',
  '..BBBBBBBBB.....',
  '.BBBBBBBBBBB....',
  '................',
]

// ══ GUANACASTECO ══════════════════════════════════════════════════════════════
const G_IDLE = [
  '.TTTTTTTTTTTTT..',
  '.THhHHHHHHHhHT..',
  '..HWWWWWWWWWH...',
  '....SSSSSSSS....',
  '....SEssMSES....',
  '.....SSSSSS.....',
  '.....SNNN.......',
  '....YYYYYYYY....',
  '...YYYYyYYYYY...',
  '..RYYYYyYYYYRr..',
  '..RRYYYYyYYRRr..',
  '....YYYYyYYY....',
  '....YYyyyyYY....',
  '....YYyyyyYY....',
  '....JJJJJJJJ....',
  '...JJJJjJJJJJ...',
  '....JjJJJjJJ....',
  '....JjJJJjJJ....',
  '....JjJJJjJJ....',
  '....JjJJJjJJ....',
  '...BBBBJJBBBB...',
  '...BBBBJJBBBB...',
  '..BBBBB.BBBBB...',
  '................',
]
const G_ATTACK = [
  '.TTTTTTTTTTTTT..',
  '.THhHHHHHHHhHT..',
  '..HWWWWWWWWWH...',
  '....SSSSSSSS....',
  '....SEssMSES....',
  '.....SSSSSS.....',
  '.....SNNN.......',
  '....YYYYYYYY....',
  '..YYYYYyYYYYYRRR',
  '..RYYYYyYYYYRRrr',
  '..RRYYYYyYYYRRRR',
  '....YYYYyYYY....',
  '....YYyyyyYY....',
  '...JJYYyyyyY....',
  '...JJJJJJJJJ....',
  '..JJJJJjJJJJJ...',
  '....JjJJJjJJ....',
  '....JjJJJjJJ....',
  '....JjJJJjJJ....',
  '....JjJJJjJJ....',
  '...BBBBJJBBBB...',
  '...BBBBJJBBBB...',
  '..BBBBB.BBBBB...',
  '................',
]

// ══ PIPI DE ESCAZÚ ═══════════════════════════════════════════════════════════
const P_IDLE = [
  '.....HHHHHh.....',
  '....HHHHHHHh....',
  '....HhHHHHhH....',
  '....SSSSSSSS....',
  '...FSSESSESF....',
  '....FFFSSSSF....',
  '.....SNNNNS.....',
  '....CCGGGGCC....',
  '...GGGGGGGGGGG..',
  '...GGgGGGGgGG...',
  '...GGGGGGGGGGG..',
  '....GGBBBGGG....',
  '....GGGGGGG.....',
  '...gGGGGGGg.....',
  '....PPPPPPP.....',
  '...PPPPPPPPP....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '...BBBPPPBBB....',
  '...BBBPPPBBB....',
  '..BBBBBPBBBBB...',
  '................',
]
const P_ATTACK = [
  '.....HHHHHh.....',
  '....HHHHHHHh....',
  '....HhHHHHhH....',
  '....SSSSSSSS....',
  '...FSSESSESF....',
  '....FFFSSSSF....',
  '.....SNNNNS.....',
  '....CCGGGGCC....',
  '...GGGGGGGGGGSSs',
  '...GGgGGGGgGGSSs',
  '...GGGGGGGGGSSss',
  '....GGBBBGGGSSs.',
  '....GGGGGGG.....',
  '...gGGGGGGg.....',
  '....PPPPPPP.....',
  '...PPPPPPPPP....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '...BBBPPPBBB....',
  '...BBBPPPBBB....',
  '..BBBBBPBBBBB...',
  '................',
]

// ══ BB7 ═══════════════════════════════════════════════════════════════════════
const B_IDLE = [
  '.....HHHHHh.....',
  '....HHHHHHHh....',
  '....HhHHHHhH....',
  '.....SSSSSSS....',
  '.....SEssES.....',
  '......SSSSS.....',
  '.....SNNNS......',
  '....RRRRRRR.....',
  '...RKKRRKKRRr...',
  '...RRRRRRRRRr...',
  '...KKRRRRKKRr...',
  '....RRRRRRR.....',
  '....KKrRrKK.....',
  '....RRRRRrR.....',
  '....PPPPPPP.....',
  '...PPPPpPPPP....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '...BBBPPPBBB....',
  '...BBBPPPBBB....',
  '..BBBBBBBBBB....',
  '................',
]
const B_ATTACK = [
  '.....HHHHHh.....',
  '....HHHHHHHh....',
  '....HhHHHHhH....',
  '.....SSSSSSS....',
  '.....SEssES.....',
  '......SSSSS.....',
  '.....SNNNS......',
  '....RRRRRRR.....',
  '..RRRKKRRKKRRrSS',
  '..RRRRRRRRRRrSSs',
  '..RRKKRRRRKKRSSs',
  '....RRRRRRR.....',
  '....KKrRrKK.....',
  '...RRRRRRrR.....',
  '....PPPPPPP.....',
  '...PPPPpPPPP....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '....PPpPPpP.....',
  '...BBBPPPBBB....',
  '...BBBPPPBBB....',
  '..BBBBBBBBBB....',
  '................',
]

// ══ EL PORCIO ═════════════════════════════════════════════════════════════════
const PO_IDLE = [
  '....HHHHHHHH....',
  '...HHHHHHHHHHH..',
  '...HhHHHHHHhH...',
  '...SSSSSSSSS....',
  '...SESsMSSES....',
  '...SMMMSSSSSS...',
  '....SNNNNSS.....',
  '..OOOOOOOOOOO...',
  '.OOOTOOOOTOOOo..',
  '.OOOTOOOOTOOOo..',
  '.OoOOOOOOOOOoo..',
  '..BBBBBBBBBBB...',
  '..BbWbbbbbWbB...',
  '..BBBBBBBBBBB...',
  '..OOOOoOoOOOO...',
  '.OOOOOoOoOOOOo..',
  '..OoOOoOoOOoO...',
  '..OOOoooOOOOO...',
  '..OoOOOOOOoO....',
  '..OoOOOOOOoO....',
  '..BBOOOOOOOBB...',
  '..BBOOOOOOOBB...',
  '.BBBBBOOOBBBBB..',
  '................',
]
const PO_ATTACK = [
  '....HHHHHHHH....',
  '...HHHHHHHHHHH..',
  '...HhHHHHHHhH...',
  '...SSSSSSSSS....',
  '...SESsMSSES....',
  '...SMMMSSSSSS...',
  '....SNNNNSS.....',
  '..OOOOOOOOOOO...',
  '.OOOTOOOOTOOOoOO',
  '.OOOTOOOOTOOOoOO',
  '.OoOOOOOOOOOooOO',
  '..BBBBBBBBBBBOO.',
  '..BbWbbbbbWbBOO.',
  '..BBBBBBBBBBB...',
  '..OOOOoOoOOOO...',
  '.OOOOOoOoOOOOo..',
  '..OoOOoOoOOoO...',
  '..OOOoooOOOOO...',
  '..OoOOOOOOoO....',
  '..OoOOOOOOoO....',
  '..BBOOOOOOOBB...',
  '..BBOOOOOOOBB...',
  '.BBBBBOOOBBBBB..',
  '................',
]

// Walk = idle con piernas alternadas (swap rows 17-18)
const walk = (idle) => {
  const f = [...idle]
  ;[f[17], f[18]] = [f[18], f[17]]
  return f
}

// Hit = sprite desplazado a la derecha 1 pixel (shift cols)
const hit = (idle) => idle.map(r => r.length >= 16 ? '.' + r.slice(0, 15) : r)

export const SPRITES = {
  keylor: {
    idle:          [K_IDLE, walk(K_IDLE)],
    walk:          [walk(K_IDLE), K_IDLE],
    jump:          [K_IDLE],
    attack_light:  [K_ATTACK],
    attack_heavy:  [K_ATTACK],
    block:         [K_IDLE],
    hit:           [K_HIT],
    dead:          [K_HIT],
  },
  guanacasteco: {
    idle:          [G_IDLE, walk(G_IDLE)],
    walk:          [walk(G_IDLE), G_IDLE],
    jump:          [G_IDLE],
    attack_light:  [G_ATTACK],
    attack_heavy:  [G_ATTACK],
    block:         [G_IDLE],
    hit:           [hit(G_IDLE)],
    dead:          [hit(G_IDLE)],
  },
  pipi: {
    idle:          [P_IDLE, walk(P_IDLE)],
    walk:          [walk(P_IDLE), P_IDLE],
    jump:          [P_IDLE],
    attack_light:  [P_ATTACK],
    attack_heavy:  [P_ATTACK],
    block:         [P_IDLE],
    hit:           [hit(P_IDLE)],
    dead:          [hit(P_IDLE)],
  },
  bb7: {
    idle:          [B_IDLE, walk(B_IDLE)],
    walk:          [walk(B_IDLE), B_IDLE],
    jump:          [B_IDLE],
    attack_light:  [B_ATTACK],
    attack_heavy:  [B_ATTACK],
    block:         [B_IDLE],
    hit:           [hit(B_IDLE)],
    dead:          [hit(B_IDLE)],
  },
  porcio: {
    idle:          [PO_IDLE, walk(PO_IDLE)],
    walk:          [walk(PO_IDLE), PO_IDLE],
    jump:          [PO_IDLE],
    attack_light:  [PO_ATTACK],
    attack_heavy:  [PO_ATTACK],
    block:         [PO_IDLE],
    hit:           [hit(PO_IDLE)],
    dead:          [hit(PO_IDLE)],
  },
  franklin: {
    idle:          [FR_IDLE, walk(FR_IDLE)],
    walk:          [walk(FR_IDLE), FR_IDLE],
    jump:          [FR_IDLE],
    attack_light:  [FR_ATTACK],
    attack_heavy:  [FR_ATTACK],
    block:         [FR_IDLE],
    hit:           [hit(FR_IDLE)],
    dead:          [hit(FR_IDLE)],
  },
}

/**
 * Dibuja un sprite pixel art en el canvas
 */
export function drawPixelSprite(ctx, fighter, animT) {
  const { id, x, y, facing, state } = fighter
  const hitCooldown = fighter.cooldowns?.hit ?? fighter.hitCooldown ?? 0
  const palette = PALETTES[id]
  const spriteSet = SPRITES[id]
  if (!palette || !spriteSet) return

  const currentState = spriteSet[state] ? state : 'idle'
  const frames = spriteSet[currentState]
  const fps = state === 'walk' ? 8 : 4
  const frameIdx = Math.floor(animT * fps) % frames.length
  const grid = frames[frameIdx]

  // Parpadeo al recibir golpe
  if (hitCooldown > 0 && Math.floor(hitCooldown * 14) % 2 === 0) return

  const cols = 16
  const rows = 24
  const spriteW = cols * PIXEL
  const spriteH = rows * PIXEL

  ctx.save()
  // Efecto de estela (After-image) si se mueve rápido o salta
  if (state === 'jump' || Math.abs(fighter.vx) > 250) {
    ctx.globalAlpha = 0.3
    const trailX = facing < 0 ? 10 : -10
    ctx.save()
    if (facing < 0) {
      ctx.translate(x + spriteW + trailX, y)
      ctx.scale(-1, 1)
    } else {
      ctx.translate(x + trailX, y)
    }
    drawGrid(ctx, grid, palette)
    ctx.restore()
  }

  ctx.globalAlpha = 1
  if (facing < 0) {
    ctx.translate(x + spriteW, y)
    ctx.scale(-1, 1)
  } else {
    ctx.translate(x, y)
  }

  drawGrid(ctx, grid, palette)
  ctx.restore()
}

/**
 * Helper para dibujar la rejilla de píxeles
 */
function drawGrid(ctx, grid, palette) {
  const rows = 24, cols = 16
  for (let row = 0; row < rows; row++) {
    const line = grid[row] || ''
    for (let col = 0; col < cols; col++) {
      const char = line[col]
      if (!char || char === '.') continue
      const color = palette[char]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(col * PIXEL, row * PIXEL, PIXEL, PIXEL)
    }
  }
}

/**
 * Sombra en el suelo estilo pixel art
 */
export function drawPixelShadow(ctx, fighter, GROUND_Y) {
  const spriteW = 16 * PIXEL
  const shadowW = fighter.state === 'jump' ? spriteW * 0.4 : spriteW * 0.7
  const shadowX = fighter.x + spriteW / 2 - shadowW / 2
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillRect(Math.round(shadowX), GROUND_Y + 2, Math.round(shadowW), 4)
}
