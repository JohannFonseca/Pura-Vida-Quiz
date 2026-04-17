import { supabase } from '../supabase'

/**
 * ranking.js
 * 
 * Este servicio maneja toda la comunicación con la tabla 'ranking' de Supabase.
 * Aquí es donde "bajamos" los mejores puntajes y "subimos" los nuevos.
 */

// ==========================================
// Función para descargar los puntajes del Top 10
// ==========================================
export async function obtenerRanking() {
  // 1. Le pedimos a Supabase que traiga todo (*) de la tabla 'ranking'
  // 2. .order('puntuacion', { ascending: false }): Lo ordena de la nota más alta a la más baja.
  // 3. .limit(10): Solo queremos a los 10 mejores para no saturar la pantalla.
  const { data, error } = await supabase
    .from('ranking')
    .select('*')
    .order('puntuacion', { ascending: false })
    .limit(10)

  // Si algo falla (ej. el internet se cayó), avisamos en la consola para saber qué pasó.
  if (error) {
    console.error('Error al obtener el ranking:', error)
    return []
  }
  
  // Si todo salió bien, devolvemos la lista de jugadores.
  return data
}

// ==========================================
// Función para guardar puntos cuando el usuario termina una partida
// ==========================================
export async function guardarPuntuacion(usuario, puntuacion) {
  // .insert(): Metemos un nuevo registro con el nombre del usuario y su puntaje.
  // Pasamos un objeto dentro de un arreglo [ { ... } ].
  const { data, error } = await supabase
    .from('ranking')
    .insert([
      { usuario: usuario, puntuacion: puntuacion }
    ])

  // Es importante revisar siempre si hubo error al guardar.
  if (error) {
    console.error('Error al guardar la puntuación:', error)
    return null
  }
  
  return data
}
