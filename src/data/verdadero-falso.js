/**
 * verdadero-falso.js
 * 
 * Aquí tenemos los mitos y realidades sobre Costa Rica.
 * Separar los datos nos ayuda a que el código del componente sea más mantenible.
 */

export const questions = [
  {
    id: 1,
    mito: 'En Costa Rica no hay ejército desde hace casi un siglo.',
    imagen: '/imagenes/verdadero-falso/vf_1_ejercito.png',
    esVerdadero: true,
    explicacion: 'Costa Rica abolió su ejército militar en 1948 bajo el mando de José Figueres Ferrer. Ese presupuesto se redirigió a la educación y salud.'
  },
  {
    id: 2,
    mito: 'Todos los días llueve en Costa Rica, sin excepción.',
    imagen: '/imagenes/verdadero-falso/vf_2_lluvia.png',
    esVerdadero: false,
    explicacion: 'Aunque es un paraíso tropical, Costa Rica tiene una época seca oficial (de diciembre a abril) donde apenas caen gotas en mucha parte del territorio.'
  },
  {
    id: 3,
    mito: 'El perezoso es un nadador veloz como un pez en el agua.',
    imagen: '/imagenes/verdadero-falso/vf_3_perezoso.png',
    esVerdadero: false,
    explicacion: 'Aunque flotan y nadan tres veces más rápido de lo que caminan en los árboles, siguen siendo lentos, no "veloces" en términos acuáticos.'
  },
  {
    id: 4,
    mito: 'Costa Rica alberga más del 5% de la biodiversidad de todo el planeta.',
    imagen: '/imagenes/verdadero-falso/vf_4_frog.png',
    esVerdadero: true,
    explicacion: 'Con apenas el 0.03% de la superficie mundial, es uno de los 20 países con mayor biodiversidad concentrada por kilómetro cuadrado.'
  },
  {
    id: 5,
    mito: 'Se puede tomar agua del grifo/caño libremente en TODO el país sin excepción.',
    imagen: '/imagenes/verdadero-falso/vf_5_agua.png',
    esVerdadero: false,
    explicacion: '¡Falso! Si bien el agua es muy segura en las áreas urbanas, en zonas costeras muy rurales o caribeñas extremas es peligroso y se recomienda embotellada.'
  },
  {
    id: 6,
    mito: 'El "Gallo Pinto" es el platillo típico inamovible para el desayuno.',
    imagen: '/imagenes/verdadero-falso/vf_6_pinto.png',
    esVerdadero: true,
    explicacion: 'Es una deliciosa mezcla de arroz, frijoles y Lizano, acompañado de huevo, queso y plátano maduro. ¡Es la bandera culinaria del desayuno tico!'
  },
  {
    id: 7,
    mito: 'La mitad de los volcanes de Costa Rica están encendidos lanzando lava todos los días.',
    imagen: '/imagenes/verdadero-falso/vf_7_volcan.png',
    esVerdadero: false,
    explicacion: 'Existen varios volcanes activos en el país respirando gases volcánicos o pequeñas erupciones, pero la caída brutal de lava constante todos los días es un mito cinemático.'
  },
  {
    id: 8,
    mito: 'Costa Rica y Puerto Rico están ubicados juntos en la geografía de Sudamérica.',
    imagen: '/imagenes/verdadero-falso/vf_8_mapa.png',
    esVerdadero: false,
    explicacion: 'El clásico mito extranjero. Costa Rica se ubica en Centroamérica (ni es una isla, ni se ubica en el pacífico de Suramérica).'
  }
]
