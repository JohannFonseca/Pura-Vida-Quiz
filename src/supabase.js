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

// 2. Inicializamos el cliente oficial de Supabase.
// Esto crea la conexión que usaremos para guardar puntajes o leer el ranking.
export const supabase = createClient(supabaseUrl, supabaseKey)
