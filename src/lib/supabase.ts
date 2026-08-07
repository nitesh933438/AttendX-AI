import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 
  (import.meta.env.VITE_SUPABASE_URL as string) || 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '') || 
  'https://dsghskncangbbkaxgczd.supabase.co';

export const supabaseAnonKey = 
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '') || 
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Notice: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from environment configuration.");
}

export const hasSupabaseKeys = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('dummy'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'attendx-supabase-auth-token',
  },
  global: {
    headers: supabaseAnonKey ? { apikey: supabaseAnonKey } : {},
  },
});


