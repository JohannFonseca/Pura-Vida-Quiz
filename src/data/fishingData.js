export const FISHING_ZONES = [
  {
    id: 'papagayo',
    nombre: 'Golfo de Papagayo',
    nivelRequerido: 1,
    descripcion: 'Aguas cristalinas y tranquilas en Guanacaste. Ideal para principiantes.',
    dificultad: 1,
    color: '#4cc9f0',
    peces: ['pargo_rojo', 'macarela', 'corvina'],
    coordenadas: { x: 15, y: 25 },
    fondo: 'linear-gradient(to bottom, #4cc9f0, #4895ef)'
  },
  {
    id: 'pacifico_central',
    nombre: 'Pacífico Central',
    nivelRequerido: 5,
    descripcion: 'Frente a Quepos y Manuel Antonio. Corrientes moderadas y gran biodiversidad.',
    dificultad: 2,
    color: '#4361ee',
    peces: ['pez_gallo', 'atun_aleta_amarilla', 'dorado'],
    coordenadas: { x: 35, y: 65 },
    fondo: 'linear-gradient(to bottom, #4361ee, #3f37c9)'
  },
  {
    id: 'golfo_dulce',
    nombre: 'Golfo Dulce',
    nivelRequerido: 10,
    descripcion: 'Uno de los pocos fiordos tropicales del mundo. Aguas profundas y misteriosas.',
    dificultad: 3,
    color: '#3a0ca3',
    peces: ['marlin_negro', 'pez_vela', 'tiburon_martillo'],
    coordenadas: { x: 75, y: 85 },
    fondo: 'linear-gradient(to bottom, #3a0ca3, #03045e)'
  },
  {
    id: 'caribe_norte',
    nombre: 'Caribe Norte',
    nivelRequerido: 15,
    descripcion: 'Canales de Tortuguero. Mezcla de agua dulce y salada con especies imponentes.',
    dificultad: 4,
    color: '#0096c7',
    peces: ['sabalo', 'robalo', 'manati_observacion'],
    coordenadas: { x: 75, y: 25 },
    fondo: 'linear-gradient(to bottom, #0096c7, #0077b6)'
  },
  {
    id: 'caribe_sur',
    nombre: 'Caribe Sur',
    nivelRequerido: 20,
    descripcion: 'Arrecifes de coral en Puerto Viejo y Cahuita. Colores vibrantes y peces exóticos.',
    dificultad: 5,
    color: '#7209b7',
    peces: ['pez_leon', 'langosta', 'pez_loro'],
    coordenadas: { x: 90, y: 55 },
    fondo: 'linear-gradient(to bottom, #7209b7, #560bad)'
  }
];

export const FISH_SPECIES = {
  pargo_rojo: {
    nombre: 'Pargo Rojo',
    cientifico: 'Lutjanus campechanus',
    descripcion: 'Un clásico de la cocina costarricense. Vive cerca de arrecifes rocosos.',
    xp: 50,
    valor: 100,
    rareza: 'Común',
    timingWindow: 0.8, // segundos para reaccionar
    velocidad: 1.5
  },
  macarela: {
    nombre: 'Macarela',
    cientifico: 'Scomberomorus maculatus',
    descripcion: 'Pez rápido y plateado, muy común en las costas de Guanacaste.',
    xp: 40,
    valor: 80,
    rareza: 'Común',
    timingWindow: 0.7,
    velocidad: 2.0
  },
  corvina: {
    nombre: 'Corvina Reina',
    cientifico: 'Cynoscion albus',
    descripcion: 'Altamente valorada por su carne blanca y suave. Habita en estuarios y costas.',
    xp: 60,
    valor: 120,
    rareza: 'Común',
    timingWindow: 0.75,
    velocidad: 1.6
  },
  pez_gallo: {
    nombre: 'Pez Gallo',
    cientifico: 'Nematistius pectoralis',
    descripcion: 'Famoso por su aleta dorsal en forma de cresta. Un luchador incansable.',
    xp: 150,
    valor: 300,
    rareza: 'Raro',
    timingWindow: 0.5,
    velocidad: 2.5
  },
  atun_aleta_amarilla: {
    nombre: 'Atún Aleta Amarilla',
    cientifico: 'Thunnus albacares',
    descripcion: 'Uno de los peces más rápidos del océano. Requiere mucha fuerza para pescarlo.',
    xp: 200,
    valor: 450,
    rareza: 'Raro',
    timingWindow: 0.45,
    velocidad: 3.0
  },
  dorado: {
    nombre: 'Dorado (Mahi-Mahi)',
    cientifico: 'Coryphaena hippurus',
    descripcion: 'Conocido por sus colores brillantes verdes y amarillos que cambian al salir del agua.',
    xp: 180,
    valor: 400,
    rareza: 'Raro',
    timingWindow: 0.55,
    velocidad: 2.8
  },
  marlin_negro: {
    nombre: 'Marlin Negro',
    cientifico: 'Istiompax indica',
    descripcion: 'El rey de la pesca deportiva. Puede pesar cientos de kilos y saltar fuera del agua.',
    xp: 500,
    valor: 1200,
    rareza: 'Épico',
    timingWindow: 0.35,
    velocidad: 3.5
  },
  pez_vela: {
    nombre: 'Pez Vela',
    cientifico: 'Istiophorus platypterus',
    descripcion: 'El pez más rápido del mundo. Costa Rica es uno de los mejores lugares para verlo.',
    xp: 450,
    valor: 1000,
    rareza: 'Épico',
    timingWindow: 0.3,
    velocidad: 4.0
  },
  sabalo: {
    nombre: 'Sábalo Real',
    cientifico: 'Megalops atlanticus',
    descripcion: 'Conocido como "El Rey de Plata". Puede vivir tanto en agua dulce como salada.',
    xp: 350,
    valor: 800,
    rareza: 'Épico',
    timingWindow: 0.4,
    velocidad: 3.2
  },
  pez_leon: {
    nombre: 'Pez León',
    cientifico: 'Pterois volitans',
    descripcion: 'Especie invasora en el Caribe. Pescarlo ayuda a proteger los arrecifes locales.',
    xp: 120,
    valor: 500,
    rareza: 'Especial',
    timingWindow: 0.6,
    velocidad: 1.8
  },
  robalo: {
    nombre: 'Robalo',
    cientifico: 'Centropomus undecimalis',
    descripcion: 'Pez muy fuerte que habita en las desembocaduras de los ríos caribeños.',
    xp: 110,
    valor: 250,
    rareza: 'Común',
    timingWindow: 0.65,
    velocidad: 2.2
  },
  langosta: {
    nombre: 'Langosta Espinosa',
    cientifico: 'Panulirus argus',
    descripcion: 'No es un pez, ¡pero es una gran captura! Se encuentra en los arrecifes del Caribe Sur.',
    xp: 300,
    valor: 900,
    rareza: 'Raro',
    timingWindow: 0.4,
    velocidad: 1.2
  },
  pez_loro: {
    nombre: 'Pez Loro',
    cientifico: 'Scaridae',
    descripcion: 'Famoso por sus colores y su pico. Es vital para la salud de los corales.',
    xp: 80,
    valor: 200,
    rareza: 'Común',
    timingWindow: 0.7,
    velocidad: 1.5
  }
};
