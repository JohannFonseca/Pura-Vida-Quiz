/**
 * ARCHIVO DE DATOS - PERSONAJES DE PELEA
 * Aquí definimos a los luchadores. Como es para un proyecto de la U,
 * lo ideal es tener los datos separados de la lógica.
 */

// 1. Tamaños únicos: Esto es clave para las colisiones (hitboxes).
// Cada personaje tiene su propia "caja" para que el gordo sea más ancho que el flaco.
// Tamaños: 16 cols × 24 rows × PIXEL(4) = 64 × 96 px
// Porcio es más ancho, BB7 más delgado, etc.
export const SIZES = {
  porcio:       { w: 64, h: 96 },
  bb7:          { w: 64, h: 96 },
  keylor:       { w: 64, h: 96 },
  guanacasteco: { w: 64, h: 96 },
  pipi:         { w: 64, h: 96 },
}

// 2. Lista de Luchadores: Array de objetos con stats y paletas de colores.
// Usamos paletas de colores hexadecimales para dibujar en el Canvas sin usar imágenes externas.
export const FIGHTERS = [
  {
    id: 'porcio',
    name: 'El Porcio',
    emoji: '🧑‍🌾',
    description: 'Brawler pesado de las fincas de San Carlos.',
    lore: 'Su fuerza proviene del gallo pinto y el trabajo duro.',
    quote: '¡Traigo el machete afilado!',
    // Stats: HP alto compensa su baja velocidad
    maxHp: 185, speed: 175, damage: 38,
    palette: { body: '#8B5E3C', belt: '#5C3317', hat: '#C9A84C', hatBrim: '#8B6914', skin: '#F4A460', shoe: '#3B1A0A' }
  },
  {
    id: 'bb7',
    name: 'BB7',
    emoji: '⚽',
    description: 'Velocista ágil con estilo de juego callejero.',
    lore: 'Nacido en las canchas de asfalto, su velocidad es su mejor arma.',
    quote: '¡Gol o muerte, mae!',
    // Glass cannon: se mueve rápido pero tiene poca vida
    maxHp: 125, speed: 330, damage: 20,
    palette: { body: '#1d4ed8', belt: '#1e3a8a', hat: '#dc2626', hatBrim: '#991b1b', skin: '#E5C298', shoe: '#0f172a' }
  },
  {
    id: 'keylor',
    name: 'Keylor Navas',
    emoji: '🧤',
    description: 'El muro defensivo. Indestructible y legendario.',
    lore: 'Protege su área como si fuera la portería de un mundial.',
    quote: '¡Aquí no pasa nadie!',
    // Tank: mucha vida, daño moderado
    maxHp: 220, speed: 225, damage: 27,
    palette: { body: '#16a34a', belt: '#14532d', hat: '#334155', hatBrim: '#1e293b', skin: '#FDDBB4', shoe: '#064e3b' }
  },
  {
    id: 'guanacasteco',
    name: 'Guanacasteco De Sepa',
    emoji: '🤠',
    description: 'Guerrero tradicional con el espíritu de la pampa.',
    lore: 'Domador de toros y experto en combate de corto alcance.',
    quote: '¡Uyuyuy bajura!',
    maxHp: 165, speed: 250, damage: 32,
    palette: { body: '#D97706', belt: '#92400E', hat: '#F5F5DC', hatBrim: '#D4A017', skin: '#C68642', shoe: '#3B1A0A' }
  },
  {
    id: 'pipi',
    name: 'Pipi de Escazú',
    emoji: '💅',
    description: 'Velocidad de élite con ataques precisos y elegantes.',
    lore: 'No dejes que su estilo te confunda, golpea donde más duele.',
    quote: '¡O sea, qué polo!',
    maxHp: 110, speed: 365, damage: 18,
    palette: { body: '#ec4899', belt: '#be185d', hat: '#FDE68A', hatBrim: '#F59E0B', skin: '#FFF1F1', shoe: '#831843' }
  },
  {
    id: 'franklin',
    name: 'Franklin Chang',
    emoji: '🚀',
    locked: true,
    description: 'Científico espacial con el poder del plasma.',
    lore: 'El primer astronauta tico, domina la física del combate.',
    quote: '¡Hacia el infinito, mae!',
    maxHp: 160, speed: 280, damage: 30,
    palette: { body: '#94a3b8', belt: '#1d4ed8', hat: '#111827', hatBrim: '#1e293b', skin: '#F4A460', shoe: '#0f172a' }
  },
]
