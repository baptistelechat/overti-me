import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification de la présence des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Les variables d\'environnement Supabase ne sont pas définies. La synchronisation ne sera pas disponible.'
  );
}

// Création du client Supabase
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Les variables d\'environnement Supabase ne sont pas définies. La synchronisation ne sera pas disponible.'
    );
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
};