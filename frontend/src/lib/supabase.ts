import { createClient } from '@supabase/supabase-js'

/* Obtiene la dirección del proyecto y la llave pública desde las variables de entorno */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/* Cliente que permite consultar la base de datos, autenticación y almacenamiento */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)