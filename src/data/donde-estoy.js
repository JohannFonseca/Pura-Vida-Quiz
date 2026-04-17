/**
 * donde-estoy.js
 * 
 * Aquí guardamos todas las preguntas del juego "¿Dónde estoy?".
 * Es mejor tenerlas en un archivo separado para que el componente de la vista 
 * no sea tan gigante y sea más fácil de leer.
 */

export const questions = [
  {
    id: 1,
    imagen: '/imagenes/donde-estoy/donde_q1_arenal.png',
    respuesta: 'Volcán Arenal',
    opciones: ['Volcán Poás', 'Volcán Arenal', 'Volcán Irazú', 'Volcán Rincón de la Vieja'],
    provincia: 'Alajuela',
    curiosidad: 'Es uno de los volcanes más activos del país y tiene una forma cónica casi perfecta.'
  },
  {
    id: 2,
    imagen: '/imagenes/donde-estoy/donde_q2_manuelantonio.png',
    respuesta: 'Parque Nacional Manuel Antonio',
    opciones: ['Tortuguero', 'Cahuita', 'Parque Nacional Manuel Antonio', 'Santa Rosa'],
    provincia: 'Puntarenas',
    curiosidad: 'Aunque es el parque nacional más pequeño de Costa Rica, es uno de los más visitados a nivel mundial.'
  },
  {
    id: 3,
    imagen: '/imagenes/donde-estoy/donde_q3_jaco.png',
    respuesta: 'Jacó',
    opciones: ['Tamarindo', 'Puerto Viejo', 'Jacó', 'Dominical'],
    provincia: 'Puntarenas',
    curiosidad: 'Famosa mundialmente por el surf y por ser la playa más cercana a la capital, San José.'
  },
  {
    id: 4,
    imagen: '/imagenes/donde-estoy/donde_q4_monteverde.jpg',
    respuesta: 'Monteverde',
    opciones: ['Cerro de la Muerte', 'Monteverde', 'Bajos del Toro', 'Río Macho'],
    provincia: 'Puntarenas',
    curiosidad: 'Famosa por sus puentes colgantes en un bosque nuboso con una biodiversidad inmensa.'
  },
  {
    id: 5,
    imagen: '/imagenes/donde-estoy/donde_q5_rioceleste.jpg',
    respuesta: 'Río Celeste',
    opciones: ['Río Savegre', 'Río Pacuare', 'Río Tarcoles', 'Río Celeste'],
    provincia: 'Alajuela',
    curiosidad: 'Su asombroso color azul claro se da por una reacción óptica de minerales volcánicos en el agua.'
  },
  {
    id: 6,
    imagen: '/imagenes/donde-estoy/donde_q6_conchal.jpg',
    respuesta: 'Playa Conchal',
    opciones: ['Playa Hermosa', 'Playa Conchal', 'Playa Flamingo', 'Playa Nosara'],
    provincia: 'Guanacaste',
    curiosidad: 'Su arena no es polvo, está compuesta por millones de conchitas trituradas por el mar.'
  },
  {
    id: 7,
    imagen: '/imagenes/donde-estoy/donde_q7_uvita.jpg',
    respuesta: 'Uvita',
    opciones: ['Dominical', 'Uvita', 'Santa Teresa', 'Mal País'],
    provincia: 'Puntarenas',
    curiosidad: 'La formación rocosa y de arena tiene forma de cola de ballena, ¡y justo ahí llegan las ballenas jorobadas cada año!'
  },
  {
    id: 8,
    imagen: '/imagenes/donde-estoy/donde_q8_chirripo.jpg',
    respuesta: 'Cerro Chirripó',
    opciones: ['Volcán Turrialba', 'Cerro Pelado', 'Cerro Chirripó', 'Cerro Kamuk'],
    provincia: 'San José / Cartago / Limón',
    curiosidad: 'Es el punto más alto de Costa Rica. En días despejados puedes ver ambos océanos desde su cima.'
  }
]
