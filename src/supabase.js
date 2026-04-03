import { createClient } from '@supabase/supabase-js'

// 1. Obtenemos las credenciales que guardamos en nuestro archivo seguro .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

// 2. Creamos la conexión oficial con nuestra base de datos
// Exportamos 'supabase' para usarlo en cualquier parte del proyecto
export const supabase = createClient(supabaseUrl, supabaseKey)
