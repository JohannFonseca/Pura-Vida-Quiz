export const CW=800,CH=450,GROUND_Y=CH-60
const GRAVITY=1800,JUMP_VEL=-640,MOVE_SPD=270,BASE_SPD=210

// ── PIXEL ART ─────────────────────────────────────────────────────────────
// Grid: 12 cols × 18 rows, each pixel = 4px on canvas → 48×72 visual size
// Palette: 0=transparent 1=outline 2=skin 3=red 4=blue 5=white 6=shoe 7=hatbrim 8=hatbody 9=skinhi 10=shadsht
const P=4
const PAL=[null,'#1a0900','#f59e0b','#dc2626','#1d4ed8','#f8fafc','#0f172a','#a16207','#78350f','#fde68a','#b91c1c','#93c5fd','#fbbf24']
//           0      1        2        3        4        5        6        7        8        9        10       11       12

// Run frame A (left leg forward)
const RA=[
  [0,0,0,7,7,7,7,7,7,0,0,0],
  [0,0,0,0,8,8,8,0,0,0,0,0],
  [0,0,0,0,8,8,8,0,0,0,0,0],
  [0,0,0,9,9,9,9,9,0,0,0,0],
  [0,0,0,9,1,1,9,9,0,0,0,0],
  [0,0,0,9,9,2,9,9,0,0,0,0],
  [0,0,3,3,3,3,3,3,3,0,0,0],
  [0,3,3,3,5,5,5,3,3,3,0,0],
  [0,3,10,3,3,3,3,3,10,3,0,0],
  [0,0,3,3,3,3,3,3,3,0,0,0],
  [0,0,0,4,4,4,4,4,0,0,0,0],
  [0,0,4,4,0,0,4,0,0,0,0,0],
  [0,2,4,4,0,0,0,4,0,0,0,0],
  [0,2,4,0,0,0,0,4,0,0,0,0],
  [0,0,4,0,0,0,0,4,0,0,0,0],
  [0,0,6,6,0,0,6,6,0,0,0,0],
  [0,0,6,6,0,0,6,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
]
// Run frame B (right leg forward, arms swing opposite)
const RB=[
  [0,0,0,7,7,7,7,7,7,0,0,0],
  [0,0,0,0,8,8,8,0,0,0,0,0],
  [0,0,0,0,8,8,8,0,0,0,0,0],
  [0,0,0,9,9,9,9,9,0,0,0,0],
  [0,0,0,9,1,1,9,9,0,0,0,0],
  [0,0,0,9,9,2,9,9,0,0,0,0],
  [0,0,3,3,3,3,3,3,3,0,0,0],
  [0,3,3,3,5,5,5,3,3,3,0,0],
  [0,3,10,3,3,3,3,3,10,3,0,0],
  [0,0,3,3,3,3,3,3,3,0,0,0],
  [0,0,0,4,4,4,4,4,0,0,0,0],
  [0,0,0,4,0,0,4,4,0,0,0,0],
  [0,0,4,0,0,0,4,4,2,0,0,0],
  [0,0,4,0,0,0,4,0,2,0,0,0],
  [0,0,4,0,0,0,4,0,0,0,0,0],
  [0,0,6,6,0,0,6,6,0,0,0,0],
  [0,0,0,6,0,0,6,6,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
]
// Jump frame (legs tucked)
const RJ=[
  [0,0,0,7,7,7,7,7,7,0,0,0],
  [0,0,0,0,8,8,8,0,0,0,0,0],
  [0,0,0,0,8,8,8,0,0,0,0,0],
  [0,0,0,9,9,9,9,9,0,0,0,0],
  [0,0,0,9,1,1,9,9,0,0,0,0],
  [0,0,0,9,9,9,9,9,0,0,0,0],
  [0,0,3,3,3,3,3,3,3,0,0,0],
  [0,3,3,3,5,5,5,3,3,3,0,0],
  [0,3,10,3,3,3,3,3,10,3,0,0],
  [0,0,3,3,3,3,3,3,3,0,0,0],
  [0,0,0,4,4,4,4,4,0,0,0,0],
  [0,3,4,4,0,0,4,4,3,0,0,0],
  [4,4,4,0,0,0,0,4,4,4,0,0],
  [4,4,0,0,0,0,0,0,4,4,0,0],
  [0,6,0,0,0,0,0,0,6,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
]

function drawFrame(ctx,frame,ox,oy){
  for(let r=0;r<frame.length;r++)
    for(let c=0;c<frame[r].length;c++){
      const ci=frame[r][c]; if(!ci||!PAL[ci]) continue
      ctx.fillStyle=PAL[ci]
      ctx.fillRect(ox+c*P, oy+r*P, P, P)
    }
}

// ── COLLECTIBLES ──────────────────────────────────────────────────────────
export const ITEMS=[
  {emoji:'🌸',label:'Guaria Morada',sub:'Flor Nacional 🇨🇷',pts:15,color:'#c084fc'},
  {emoji:'🐸',label:'Rana Roja',sub:'Símbolo de CR',pts:20,color:'#ef4444'},
  {emoji:'☕',label:'Café de CR',sub:'Orgullo Exportador',pts:10,color:'#92400e'},
  {emoji:'🌋',label:'Volcán Arenal',sub:'Maravilla Natural',pts:25,color:'#f97316'},
  {emoji:'🐢',label:'Tortuga Baula',sub:'Especie Protegida',pts:20,color:'#16a34a'},
]

// ── AUDIO ─────────────────────────────────────────────────────────────────
let _ac=null
const ac=()=>{if(!_ac)_ac=new(window.AudioContext||window.webkitAudioContext)();return _ac}
function tone(f,t,d,v=0.12){try{const a=ac(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+d);o.start();o.stop(a.currentTime+d)}catch(_){}}
export const sfx={
  jump:()=>tone(350,'sine',0.12,0.08),
  collect:()=>{tone(523,'sine',0.1);setTimeout(()=>tone(784,'sine',0.15),120)},
  hit:()=>tone(180,'sawtooth',0.3,0.2),
  over:()=>{tone(300,'sawtooth',0.15);setTimeout(()=>tone(200,'sawtooth',0.3),150)},
}

// ── HELPERS ───────────────────────────────────────────────────────────────
export const aabb=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y
function _rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath()}

// Background image (loaded once)
let bgImg=null
function loadBg(){
  if(bgImg) return
  bgImg=new Image()
  bgImg.src='/imagenes/minijuego_bg_seamless.png'
}

// ── STATE ─────────────────────────────────────────────────────────────────
export function makeState(){
  loadBg()
  return{
    player:{x:120,y:GROUND_Y-72,vx:0,vy:0,w:40,h:72,onGround:false,inv:0,frame:0,frameT:0},
    obstacles:[],collectibles:[],labels:[],particles:[],
    clouds:Array.from({length:6},(_,i)=>({x:i*155+Math.random()*50,y:28+Math.random()*70,r:28+Math.random()*30,spd:0.22+Math.random()*0.18})),
    worldSpd:BASE_SPD,elapsed:0,score:0,lives:3,
    spawnT:0,coinT:0,bgScroll:0,groundOff:0,
  }
}

// ── UPDATE ────────────────────────────────────────────────────────────────
export function update(gs,dt,keys,onDie,onScore){
  const p=gs.player
  gs.elapsed+=dt
  gs.worldSpd=BASE_SPD+gs.elapsed*11

  if(keys['ArrowLeft']||keys['a']) p.vx=-MOVE_SPD
  else if(keys['ArrowRight']||keys['d']) p.vx=MOVE_SPD
  else p.vx*=0.78
  p.vy+=GRAVITY*dt
  p.x+=p.vx*dt; p.y+=p.vy*dt
  p.x=Math.max(0,Math.min(CW-p.w,p.x))
  if(p.y+p.h>=GROUND_Y){p.y=GROUND_Y-p.h;p.vy=0;p.onGround=true}else p.onGround=false
  if(p.inv>0) p.inv-=dt

  p.frameT+=dt
  if(p.onGround&&p.frameT>0.1){p.frame=(p.frame+1)%2;p.frameT=0}

  gs.spawnT+=dt
  const si=Math.max(0.9,2.6-gs.elapsed*0.025)
  if(gs.spawnT>=si){spawnObs(gs);gs.spawnT=0}
  gs.coinT+=dt
  if(gs.coinT>=1.6){spawnCoin(gs);gs.coinT=0}
  gs.score+=dt*6; onScore(Math.floor(gs.score))

  for(let i=gs.obstacles.length-1;i>=0;i--){
    const o=gs.obstacles[i]; o.x-=gs.worldSpd*dt
    if(o.x+o.w<0){gs.obstacles.splice(i,1);continue}
    if(p.inv<=0&&aabb(p,o)){gs.obstacles.splice(i,1);gs.lives--;p.inv=1.5;sfx.hit();if(gs.lives<=0){sfx.over();onDie(Math.floor(gs.score))}}
  }
  for(let i=gs.collectibles.length-1;i>=0;i--){
    const c=gs.collectibles[i]; c.x-=gs.worldSpd*dt
    if(c.x+c.w<0){gs.collectibles.splice(i,1);continue}
    if(aabb(p,c)){
      const it=gs.collectibles.splice(i,1)[0]
      gs.score+=it.pts;sfx.collect();onScore(Math.floor(gs.score))
      gs.labels.push({x:it.x,y:it.y-10,text:it.label,sub:it.sub,color:it.color,life:2})
      for(let k=0;k<8;k++) gs.particles.push({x:it.x+18,y:it.y+18,vx:(Math.random()-.5)*200,vy:-Math.random()*200-60,life:.7+Math.random()*.3,color:it.color,r:3+Math.random()*4})
    }
  }
  for(let i=gs.labels.length-1;i>=0;i--){gs.labels[i].y-=38*dt;gs.labels[i].life-=dt;if(gs.labels[i].life<=0)gs.labels.splice(i,1)}
  for(let i=gs.particles.length-1;i>=0;i--){const q=gs.particles[i];q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=400*dt;q.life-=dt;if(q.life<=0)gs.particles.splice(i,1)}

  // bgScroll avanza en 'píxeles de pantalla'. 
  // Primero calculamos el ancho que tiene la imagen al escalarse al alto del canvas (CH)
  const scaledW = bgImg && bgImg.naturalHeight > 0 ? Math.round(bgImg.naturalWidth * (CH / bgImg.naturalHeight)) : CW
  gs.bgScroll = (gs.bgScroll + gs.worldSpd * 0.18 * dt) % scaledW
  gs.groundOff = (gs.groundOff + gs.worldSpd * dt) % 80
}

function spawnObs(gs){
  const t=['tree','rock','cactus'][Math.floor(Math.random()*3)]
  const h=t==='rock'?34+Math.random()*24:54+Math.random()*36
  const w=t==='rock'?46+Math.random()*20:32+Math.random()*14
  gs.obstacles.push({x:CW+40,y:GROUND_Y-h,w,h,type:t})
}
function spawnCoin(gs){
  const it=ITEMS[Math.floor(Math.random()*ITEMS.length)]
  const y=Math.random()>.35?GROUND_Y-85-Math.random()*65:GROUND_Y-52
  gs.collectibles.push({...it,x:CW+20,y,w:36,h:36})
}

// ── RENDER ────────────────────────────────────────────────────────────────
export function render(ctx,gs,score,lives,best){
  // ── BACKGROUND SEAMLESS SCROLL ────────────────────────────────────────────
  // Técnica: fit-height tiling.
  // La imagen se escala para que su alto llene el canvas exacto (CH).
  // Su ancho escalado (scaledW) es el "tile" que se repite horizontalmente.
  // bgScroll avanza módulo scaledW, así que el último pixel de un tile
  // coincide exactamente con el primero del siguiente → loop invisible.
  if(bgImg&&bgImg.complete&&bgImg.naturalWidth>0){
    const iW=bgImg.naturalWidth, iH=bgImg.naturalHeight
    const scaledW = Math.round(iW * (CH / iH))
    
    // El scroll ya está normalizado a scaledW (0 a scaledW)
    const ox = gs.bgScroll % scaledW
    
    // Dibujamos suficientes copias para cubrir TODO el ancho del canvas (CW)
    // Empezamos desde -ox y vamos sumando scaledW hasta pasar CW
    for (let x = -ox; x < CW; x += scaledW) {
      ctx.drawImage(bgImg, x, 0, scaledW, CH)
    }
    
    // Overlay oscuro hacia el suelo para integrar con el pasto
    const ov=ctx.createLinearGradient(0,0,0,CH)
    ov.addColorStop(0,'rgba(0,0,0,0)')
    ov.addColorStop(0.62,'rgba(0,0,0,0)')
    ov.addColorStop(1,'rgba(0,30,0,0.5)')
    ctx.fillStyle=ov; ctx.fillRect(0,0,CW,CH)
  } else {
    // Fallback sky
    const sky=ctx.createLinearGradient(0,0,0,CH)
    sky.addColorStop(0,'#0c4a6e'); sky.addColorStop(0.5,'#38bdf8'); sky.addColorStop(1,'#e0f2fe')
    ctx.fillStyle=sky; ctx.fillRect(0,0,CW,CH)
  }

  // Ground — drawn on top of image
  const gg=ctx.createLinearGradient(0,GROUND_Y,0,CH)
  gg.addColorStop(0,'#4ade80'); gg.addColorStop(0.1,'#22c55e'); gg.addColorStop(0.3,'#15803d'); gg.addColorStop(1,'#14532d')
  ctx.fillStyle=gg; ctx.fillRect(0,GROUND_Y,CW,CH-GROUND_Y)
  ctx.fillStyle='#a16207'; ctx.fillRect(0,GROUND_Y+24,CW,7)

  // Grass tufts
  ctx.strokeStyle='#86efac'; ctx.lineWidth=1.5
  const off=gs.groundOff%40
  for(let x=-off;x<CW;x+=40){
    for(const dx of [0,9,18]){
      ctx.beginPath();ctx.moveTo(x+dx,GROUND_Y);ctx.lineTo(x+dx-3,GROUND_Y-8);ctx.stroke()
      ctx.beginPath();ctx.moveTo(x+dx,GROUND_Y);ctx.lineTo(x+dx+3,GROUND_Y-10);ctx.stroke()
    }
  }

  // Obstacles
  for(const o of gs.obstacles) drawObstacle(ctx,o)

  // Collectibles
  ctx.textAlign='center'; ctx.textBaseline='middle'
  for(const c of gs.collectibles){
    ctx.shadowColor=c.color; ctx.shadowBlur=14
    ctx.font='28px serif'; ctx.fillText(c.emoji,c.x+c.w/2,c.y+c.h/2)
    ctx.shadowBlur=0
  }

  // Particles
  for(const q of gs.particles){ctx.globalAlpha=Math.max(0,q.life);ctx.fillStyle=q.color;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);ctx.fill()}
  ctx.globalAlpha=1

  // Player
  drawPlayer(ctx,gs.player,gs.elapsed)

  // Float labels
  ctx.textAlign='center'
  for(const l of gs.labels){
    ctx.globalAlpha=Math.min(1,l.life)
    ctx.font='bold 13px system-ui'; ctx.fillStyle='white'; ctx.fillText(l.text,l.x+18,l.y)
    ctx.font='11px system-ui'; ctx.fillStyle=l.color; ctx.fillText(l.sub,l.x+18,l.y+17)
  }
  ctx.globalAlpha=1

  drawHUD(ctx,gs,score,lives,best)
}

// ── OBSTACLES ─────────────────────────────────────────────────────────────
function drawObstacle(ctx,o){
  if(o.type==='rock') drawRock(ctx,o)
  else if(o.type==='tree') drawTree(ctx,o)
  else drawCactus(ctx,o)
}
function drawRock(ctx,o){
  const cx=o.x+o.w/2,rx=o.w/2,ry=o.h/2
  ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(cx,GROUND_Y+2,rx*.7,5,0,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#57534e'; ctx.beginPath()
  ctx.moveTo(o.x+o.w*.12,o.y+o.h*.78); ctx.lineTo(o.x+o.w*.04,o.y+o.h*.48)
  ctx.lineTo(o.x+o.w*.18,o.y+o.h*.12); ctx.lineTo(o.x+o.w*.45,o.y+o.h*.02)
  ctx.lineTo(o.x+o.w*.78,o.y+o.h*.10); ctx.lineTo(o.x+o.w*.96,o.y+o.h*.42)
  ctx.lineTo(o.x+o.w*.88,o.y+o.h*.82); ctx.lineTo(o.x+o.w*.52,o.y+o.h*.98)
  ctx.closePath(); ctx.fill()
  ctx.fillStyle='#78716c'; ctx.beginPath()
  ctx.moveTo(o.x+o.w*.25,o.y+o.h*.22); ctx.lineTo(o.x+o.w*.72,o.y+o.h*.15)
  ctx.lineTo(o.x+o.w*.80,o.y+o.h*.55); ctx.lineTo(o.x+o.w*.20,o.y+o.h*.60)
  ctx.closePath(); ctx.fill()
  ctx.fillStyle='rgba(255,255,255,0.16)'; ctx.beginPath(); ctx.ellipse(cx-rx*.22,o.y+ry*.5,rx*.26,ry*.2,-.5,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle='#44403c'; ctx.lineWidth=1
  ctx.beginPath(); ctx.moveTo(cx-4,o.y+ry*.7); ctx.lineTo(cx+10,o.y+ry*1.2); ctx.lineTo(cx+6,o.y+ry*1.6); ctx.stroke()
  ctx.fillStyle='#4ade80'; ctx.globalAlpha=0.5
  ctx.beginPath(); ctx.arc(o.x+o.w*.68,o.y+o.h*.72,5,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(o.x+o.w*.58,o.y+o.h*.80,3,0,Math.PI*2); ctx.fill()
  ctx.globalAlpha=1
}
function drawTree(ctx,o){
  const tx=o.x+o.w/2
  ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(tx,GROUND_Y+3,o.w*.5,5,0,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#78350f'; ctx.fillRect(tx-o.w*.16,o.y+o.h*.5,o.w*.32,o.h*.5)
  ctx.strokeStyle='#92400e'; ctx.lineWidth=1
  for(let y=o.y+o.h*.55;y<o.y+o.h*.95;y+=9){ctx.beginPath();ctx.moveTo(tx-o.w*.16,y);ctx.bezierCurveTo(tx,y+3,tx,y-2,tx+o.w*.16,y+1);ctx.stroke()}
  ctx.fillStyle='#14532d'; ctx.beginPath(); ctx.arc(tx,o.y+o.h*.45,o.w*.62,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#166534'; ctx.beginPath(); ctx.arc(tx-o.w*.2,o.y+o.h*.36,o.w*.44,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#15803d'; ctx.beginPath(); ctx.arc(tx+o.w*.18,o.y+o.h*.33,o.w*.42,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#22c55e'; ctx.beginPath(); ctx.arc(tx,o.y+o.h*.20,o.w*.34,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='rgba(134,239,172,0.3)'; ctx.beginPath(); ctx.arc(tx-o.w*.1,o.y+o.h*.17,o.w*.14,0,Math.PI*2); ctx.fill()
}
function drawCactus(ctx,o){
  ctx.fillStyle='#166534'
  ctx.fillRect(o.x+o.w*.32,o.y,o.w*.36,o.h)
  ctx.fillRect(o.x,o.y+o.h*.32,o.w*.36,o.h*.26)
  ctx.fillRect(o.x+o.w*.64,o.y+o.h*.22,o.w*.36,o.h*.26)
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=1
  for(let y=o.y+o.h*.1;y<o.y+o.h*.9;y+=10){ctx.beginPath();ctx.moveTo(o.x+o.w*.32,y);ctx.lineTo(o.x+o.w*.68,y);ctx.stroke()}
}

// ── PLAYER ────────────────────────────────────────────────────────────────
function drawPlayer(ctx,p,elapsed){
  if(p.inv>0&&Math.floor(p.inv*8)%2===0) return
  // Ground shadow
  ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath()
  ctx.ellipse(p.x+p.w/2,GROUND_Y+3,p.w/2,5,0,0,Math.PI*2); ctx.fill()
  // Pixel art frame — offset so character is centered on hitbox
  const frame=p.onGround?(p.frame===0?RA:RB):RJ
  const offX=p.x+(p.w-12*P)/2   // center 12-col grid on hitbox
  const offY=p.y+(p.h-18*P)/2   // center 18-row grid on hitbox
  ctx.imageSmoothingEnabled=false
  drawFrame(ctx,frame,offX,offY)
}

// ── HUD ───────────────────────────────────────────────────────────────────
function drawHUD(ctx,gs,score,lives,best){
  ctx.fillStyle='rgba(0,0,0,0.48)'; _rr(ctx,10,10,160,46,10); ctx.fill()
  ctx.fillStyle='white'; ctx.font='bold 14px system-ui'; ctx.textAlign='left'; ctx.textBaseline='middle'
  ctx.fillText('⭐ '+score+' pts',22,28)
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='11px system-ui'
  ctx.fillText('⚡ x'+(gs.worldSpd/BASE_SPD).toFixed(1),22,44)
  let h=''; for(let i=0;i<3;i++) h+=i<lives?'❤️':'🖤'
  ctx.font='20px serif'; ctx.textAlign='right'; ctx.fillText(h,CW-10,30)
  if(best>0){
    ctx.fillStyle='rgba(0,0,0,0.42)'; _rr(ctx,CW/2-58,10,116,32,8); ctx.fill()
    ctx.fillStyle='#fde68a'; ctx.font='bold 12px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'
    ctx.fillText('🏆 '+best,CW/2,26)
  }
  ctx.fillStyle='rgba(255,255,255,0.28)'; ctx.font='10px system-ui'; ctx.textAlign='right'
  ctx.fillText('P = pausa',CW-8,CH-8)
}
