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
  // Verificamos si Supabase está activo para evitar errores de "undefined"
  if (!supabase) {
    console.warn('Ranking no disponible: Supabase no está configurado (revisar variables de entorno).')
    return []
  }

  const { data, error } = await supabase
    .from('ranking')
    .select('*')
    .order('puntuacion', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error al obtener el ranking:', error)
    return []
  }
  
  return data
}

// ==========================================
// Función para guardar puntos cuando el usuario termina una partida
// ==========================================
export async function guardarPuntuacion(usuario, puntuacion, sala = '') {
  // Misma validación de seguridad aquí
  if (!supabase) {
    console.warn('No se puede guardar la puntuación: Supabase no está configurado.')
    return null
  }

  const { data, error } = await supabase
    .from('ranking')
    .insert([
      { 
        usuario: usuario, 
        puntuacion: puntuacion,
        sala: sala 
      }
    ])
    .select()

  if (error) {
    console.error('Error al guardar la puntuación:', error)
    return null
  }
  
  return data
}
