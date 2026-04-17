/**
 * sobrevive.js
 * 
 * Situaciones de supervivencia en la selva y playas de Costa Rica.
 * Este archivo contiene toda la "base de datos" local del juego.
 */

export const questions = [
  {
    imagen: '/imagenes/sobrevive/sobrevive_q1_serpiente.png',
    texto: 'Vas caminando por un sendero denso en la selva y notas a una serpiente terciopelo descansando sobre una rama baja justo frente a ti. ¿Qué haces?',
    opciones: [
      { id: 'a', texto: 'Retroceder lentamente sin hacer movimientos bruscos.', correcta: true },
      { id: 'b', texto: 'Tirarle una piedra para asustarla.', correcta: false },
      { id: 'c', texto: 'Correr rápido a su lado antes de que reaccione.', correcta: false }
    ],
    explicacion: 'Las serpientes responden al movimiento rápido y vibraciones. Retroceder es la mejor opción para evitar ataques.'
  },
  {
    imagen: '/imagenes/sobrevive/sobrevive_q2_corriente.png',
    texto: 'Estás nadando en la playa de Santa Teresa y sientes que una corriente de resaca te tira cada vez más hacia adentro. ¿Cuál es tu reacción?',
    opciones: [
      { id: 'a', texto: 'Nadar con todas mis fuerzas directo hacia la orilla.', correcta: false },
      { id: 'b', texto: 'Dejarme llevar hasta que termine.', correcta: false },
      { id: 'c', texto: 'Nadar en paralelo a la orilla hasta salir de la corriente y luego acercarme.', correcta: true }
    ],
    explicacion: 'Las corrientes de resaca no te jalan bajo el agua. Nadar en paralelo es la única forma efectiva de escapar.'
  },
  {
    imagen: '/imagenes/sobrevive/sobrevive_q3_perdido.png',
    texto: 'Estás en el medio del Parque Nacional Corcovado y perdiste el sendero por completo. Ya casi anochece. ¿Qué haces?',
    opciones: [
      { id: 'a', texto: 'Caminar lo más rápido posible en una sola dirección.', correcta: false },
      { id: 'b', texto: 'Quedarme donde estoy y organizar un refugio antes de que caiga el sol.', correcta: true },
      { id: 'c', texto: 'Gritar súper fuerte y caminar buscando un río.', correcta: false }
    ],
    explicacion: 'Caminar de noche en la selva es extremadamente peligroso. Es mejor hacer un campamento improvisado y esperar luz.'
  },
  {
    imagen: '/imagenes/sobrevive/sobrevive_q4_agua.png',
    texto: 'Te quedaste sin agua en la selva, pero encontrás una fuente de agua en forma de cascada pequeña de apariencia cristalina. ¿Es seguro beberla?',
    opciones: [
      { id: 'a', texto: 'Sí, porque el agua que fluye es segura.', correcta: false },
      { id: 'b', texto: 'No, siempre se debe purificar o hervir primero.', correcta: true },
      { id: 'c', texto: 'Solo si pruebo un poco y sabe normal.', correcta: false }
    ],
    explicacion: 'Incluso el agua más clara en la naturaleza puede contener bacterias, parásitos o desechos de animales arriba.'
  },
  {
    imagen: '/imagenes/sobrevive/sobrevive_q5_raya.png',
    texto: 'Al caminar en aguas poco profundas de una playa con arena clara, pisás algo blando y sientes un dolor intenso, es una mantarraya. ¿Qué debés hacer primero?',
    opciones: [
      { id: 'a', texto: 'Sacar el aguijón si quedó y poner mucha agua caliente en la herida.', correcta: true },
      { id: 'b', texto: 'Poner hielo de inmediato para calmar el dolor.', correcta: false },
      { id: 'c', texto: 'Lavar con agua de mar y taparlo con arena fría.', correcta: false }
    ],
    explicacion: 'El veneno de raya se descompone con altas temperaturas, por ende remojar en agua tolerablemente caliente apacigua el dolor gravemente.'
  },
  {
    imagen: '/imagenes/sobrevive/sobrevive_q6_tormenta.png',
    texto: 'Se desata una tormenta tropical intensísima. Estás en un área plana cerca de un río pero la lluvia arrecia. ¿Dónde buscás refugio?',
    opciones: [
      { id: 'a', texto: 'En la orilla del río esperando a que pare la lluvia.', correcta: false },
      { id: 'b', texto: 'Subo de inmediato a terreno alto, lejos del cauce del río.', correcta: true },
      { id: 'c', texto: 'Me cubro debajo del árbol más grande de la zona plana.', correcta: false }
    ],
    explicacion: 'Las cabezas de agua pueden inundar áreas en minutos. Evita los árboles por relámpagos.'
  },
  {
    imagen: '/imagenes/sobrevive/sobrevive_q7_frutas.png',
    texto: 'Llevas horas sin comer y ves unas frutas silvestres llamativas y jugosas en un árbol. ¿Cuáles son las reglas?',
    opciones: [
      { id: 'a', texto: 'Si los tucanes las comen, yo también puedo.', correcta: false },
      { id: 'b', texto: 'Toco un poco con los labios y espero.', correcta: false },
      { id: 'c', texto: 'Evitarlas completamente si no sé al 100% qué es.', correcta: true }
    ],
    explicacion: 'Muchas plantas tropicales son tóxicas. Que los animales las coman no significa que sean seguras para el humano.'
  },
  {
    imagen: '/imagenes/sobrevive/sobrevive_q8_hormiga.png',
    texto: 'Al apoyarte en un árbol gigante agarraste por error una "Hormiga Bala", conocida por ser el dolor de insecto más fuerte del mundo. ¿Qué hacés?',
    opciones: [
      { id: 'a', texto: 'Tomar analgésicos que ande e inmovilizar la parte afectada.', correcta: true },
      { id: 'b', texto: 'Orinarme la mano para neutralizar el ácido.', correcta: false },
      { id: 'c', texto: 'Chupar el veneno y escupirlo rápidamente.', correcta: false }
    ],
    explicacion: 'Orinarse es inútil y succionar es mito de película. Tratar la picadura inmovilizándola alivia ligeramente el inmenso dolor inicial.'
  }
]
