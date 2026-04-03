import { supabase } from '../supabase'

// ==========================================
// Función para descargar los puntajes del Top
// ==========================================
export async function obtenerRanking() {
  // Le pedimos a Supabase que traiga todo (*) de la tabla 'ranking'
  // y que lo ordene de mayor a menor puntaje (ascending: false).
  // limit(10) es para que solo traiga a los 10 mejores.
  const { data, error } = await supabase
    .from('ranking')
    .select('*')
    .order('puntuacion', { ascending: false })
    .limit(10)

  // Si ocurre un error (ej. sin internet), avisamos en consola y devolvemos vacío
  if (error) {
    console.error('Error al obtener el ranking:', error)
    return []
  }
  
  // Devolvemos la lista de jugadores que encontró
  return data
}

// ==========================================
// Función para guardar puntos cuando el usuario pierde/gana
// ==========================================
export async function guardarPuntuacion(usuario, puntuacion) {
  // Le pedimos a Supabase insertar un nuevo "renglón" en la tabla
  const { data, error } = await supabase
    .from('ranking')
    .insert([
      { usuario: usuario, puntuacion: puntuacion }
    ])

  if (error) {
    console.error('Error al guardar la puntuación:', error)
    return null
  }
  
  return data
}
