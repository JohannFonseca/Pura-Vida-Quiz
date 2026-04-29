/**
 * ARCHIVO DE DATOS - PERSONAJES DE PELEA
 * Aquí definimos a los luchadores. Como es para un proyecto de la U,
 * lo ideal es tener los datos separados de la lógica.
 */

// 1. Tamaños únicos: Esto es clave para las colisiones (hitboxes).
// Cada personaje tiene su propia "caja" para que el gordo sea más ancho que el flaco.
export const SIZES = {
  porcio: { w: 68, h: 74 },      // El Porcio es bajito pero ancho
  bb7: { w: 26, h: 90 },         // BB7 es flaco y alto (difícil de golpear)
  keylor: { w: 52, h: 83 },      // Keylor tiene medidas atléticas
  guanacasteco: { w: 48, h: 80 },
  pipi: { w: 34, h: 86 },
}

// 2. Lista de Luchadores: Array de objetos con stats y paletas de colores.
// Usamos paletas de colores hexadecimales para dibujar en el Canvas sin usar imágenes externas.
export const FIGHTERS = [
  {
    id: 'porcio',
    name: 'El Porcio',
    emoji: '🧑‍🌾',
    description: 'Gordo y bruto, pero pega duro',
    lore: 'Trabajador de finca, come casado tres veces al día',
    // Stats: HP alto compensa su baja velocidad
    maxHp: 185, speed: 175, damage: 38,
    palette: { body: '#8B5E3C', belt: '#5C3317', hat: '#C9A84C', hatBrim: '#8B6914', skin: '#F4A460', shoe: '#3B1A0A' }
  },
  {
    id: 'bb7',
    name: 'BB7',
    emoji: '⚽',
    description: 'Flaco, feo, pero rapidísimo',
    lore: 'El delantero más feo del torneo de barrio',
    // Glass cannon: se mueve rápido pero tiene poca vida
    maxHp: 125, speed: 330, damage: 20,
    palette: { body: '#1d4ed8', belt: '#1e3a8a', hat: '#dc2626', hatBrim: '#991b1b', skin: '#E5C298', shoe: '#0f172a' }
  },
  {
    id: 'keylor',
    name: 'Keylor Navas',
    emoji: '🧤',
    description: 'Apuesto e indestructible',
    lore: 'El mejor portero tico de todos los tiempos',
    // Tank: mucha vida, daño moderado
    maxHp: 220, speed: 225, damage: 27,
    palette: { body: '#16a34a', belt: '#14532d', hat: '#334155', hatBrim: '#1e293b', skin: '#FDDBB4', shoe: '#064e3b' }
  },
  {
    id: 'guanacasteco',
    name: 'Guanacasteco De Sepa',
    emoji: '🤠',
    description: 'El que come de todo, no se muere de hamnbre',
    lore: 'Sale del monte a defender su rancho',
    maxHp: 165, speed: 250, damage: 32,
    palette: { body: '#D97706', belt: '#92400E', hat: '#F5F5DC', hatBrim: '#D4A017', skin: '#C68642', shoe: '#3B1A0A' }
  },
  {
    id: 'pipi',
    name: 'Pipi de Escazú',
    emoji: '💅',
    description: 'Mimada pero rapidísima',
    lore: 'Llega en su Land Rover a dar golpes con el bolso',
    maxHp: 110, speed: 365, damage: 18,
    palette: { body: '#ec4899', belt: '#be185d', hat: '#FDE68A', hatBrim: '#F59E0B', skin: '#FFF1F1', shoe: '#831843' }
  },
]
