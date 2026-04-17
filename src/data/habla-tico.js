/**
 * habla-tico.js
 * 
 * Diccionario de frases para el juego "Habla como tico".
 * Separamos los datos del componente para que el código sea más "limpio" (Clean Code).
 */

export const questions = [
  {
    id: 1,
    expresion: 'Mae, qué pereza',
    tipo: 'Traducción',
    imagen: 'https://placehold.co/600x400/2dd4bf/ffffff?text=Mae,+que+pereza',
    opciones: ['Estoy cansado', 'No quiero hacer nada', 'Tengo hambre', 'Estoy feliz'],
    respuesta: 'No quiero hacer nada',
    significado: 'Falta total de motivación o ganas de hacer una actividad.',
    ejemplo: '— ¿Vamos al cine? — Uf mae, qué pereza, mejor veamos Netflix.'
  },
  {
    id: 2,
    expresion: 'Está mamando',
    tipo: 'Uso en Contexto',
    imagen: 'https://placehold.co/600x400/fbbf24/ffffff?text=Esta+mamando',
    opciones: ['Está acertando', 'Está equivocado', 'Está comiendo', 'Está corriendo'],
    respuesta: 'Está equivocado',
    significado: 'Estar completamente perdido, equivocado o no saber nada del tema.',
    ejemplo: 'Si creés que el examen de conta está fácil, estás mamando.'
  },
  {
    id: 3,
    expresion: 'Pura vida',
    tipo: 'Aclaración de Significado',
    imagen: 'https://placehold.co/600x400/4ade80/ffffff?text=Pura+vida',
    opciones: [
      'Saludar, despedirse o decir que todo está bien',
      'Pedir comida en la calle',
      'Insultar amigablemente',
      'Llamar la atención'
    ],
    respuesta: 'Saludar, despedirse o decir que todo está bien',
    significado: 'La frase nacional por excelencia para indicar optimismo y buena vibra.',
    ejemplo: '— ¿Cómo le fue en el viaje? — Pura vida.'
  },
  {
    id: 4,
    expresion: '¿Al chile?',
    tipo: 'Situación Real',
    imagen: 'https://placehold.co/600x400/60a5fa/ffffff?text=Al+chile?',
    preguntaVisual: 'Te cuentan un chisme increíble y decís "¿Al chile?"',
    opciones: ['¿Eso tiene picante?', '¿En serio? / De verdad', 'Tengo mucho frío', 'Me enojé'],
    respuesta: '¿En serio? / De verdad',
    significado: 'Expresión para pedir confirmación sobre algo sorprendente o que cuesta creer.',
    ejemplo: '— Mae, me echaron del brete ayer. — Nombres... ¿al chile?'
  },
  {
    id: 5,
    expresion: 'Tengo que ir a bretear',
    tipo: 'Traducción',
    imagen: 'https://placehold.co/600x400/f43f5e/ffffff?text=Bretear',
    opciones: ['Tengo que ir a pelear', 'Tengo que ir a trabajar', 'Tengo que ir a dormir', 'Tengo que estudiar'],
    respuesta: 'Tengo que ir a trabajar',
    significado: 'Brete = Trabajo. Bretear = Trabajar.',
    ejemplo: 'Me quedé sin plata, me toca agarrar un brete pesado.'
  },
  {
    id: 6,
    expresion: '¡Qué jeta!',
    tipo: 'Aclaración',
    imagen: 'https://placehold.co/600x400/a78bfa/ffffff?text=Que+jeta!',
    opciones: ['¡Qué feo!', '¡Qué ridículo!', '¡No te lo puedo creer!', '¡Callate la boca!'],
    respuesta: '¡No te lo puedo creer!',
    significado: 'Se usa para mostrar un tremendo asombro o incredulidad sobre un evento inesperado.',
    ejemplo: '— Mae, me pegué la lotería. — ¡Nombres, qué jeta!'
  },
  {
    id: 7,
    expresion: 'Nos echamos un yodo',
    tipo: 'Tradición Local',
    imagen: 'https://placehold.co/600x400/9ca3af/ffffff?text=Un+yodo',
    opciones: ['Nos tomamos una cerveza', 'Nos tomamos un café', 'Nos tomamos un ron', 'Fuimos a la playa'],
    respuesta: 'Nos tomamos un café',
    significado: 'El color oscuro del yodo se compara popularmente con el café chorreado.',
    ejemplo: 'Llegue a la casa a eso de  las 3pm y nos mandamos un yodo con pan.'
  },
  {
    id: 8,
    expresion: 'Me ahuevas',
    tipo: 'Emocional',
    imagen: 'https://placehold.co/600x400/0ea5e9/ffffff?text=Me+ahuevas',
    opciones: ['Me hacés reír asombrosamente', 'Me decepcionás increíblemente', 'Me asustás demasiado', 'Me aburrís'],
    respuesta: 'Me decepcionás increíblemente',
    significado: 'Quitar los ánimos, desilusionar, poner triste o bajarle el hype a alguien.',
    ejemplo: 'Ah mae no, llevamos toda la semana organizando el viaje y ahora nos cansélás... me ahuevas al chile.'
  }
]
