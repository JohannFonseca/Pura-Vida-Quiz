import { createClient } from '@supabase/supabase-js'

/**
 * supabase.js
 * 
 * Este archivo es como el "puente" entre nuestro código y la base de datos en la nube.
 * Usamos variables de entorno (.env) para no subir nuestras llaves secretas a GitHub.
 */

// 1. Cargamos la URL y la Llave Pública de Supabase desde el archivo .env
// Vite usa 'import.meta.env' para leer estas variables de forma segura.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

// 2. Inicializamos el cliente solo si tenemos las credenciales.
// IMPORTANTE: Esto evita que la app "muera" (crash) si faltan las variables de entorno en Vercel.
// Si no están, la app sigue funcionando pero las funciones de ranking se desactivan con un aviso.
let supabaseInstance = null

if (supabaseUrl && supabaseKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseKey)
} else {
  // Nota para mi mismo: Si sale este mensaje en Vercel, es que olvidé configurar las Env Variables.
  console.warn('⚠️ Supabase URL o Key no encontradas. Las funciones de base de datos no estarán disponibles.')
}

export const supabase = supabaseInstance
