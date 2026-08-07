import { createClient } from '@supabase/supabase-js'

export const supabaseUrlRaw = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '') || '';
export const supabaseUrl = supabaseUrlRaw.replace(/\/rest\/v1\/?$/, '');
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '') || '';

export const hasSupabaseKeys = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('dummy'));

export const supabase = hasSupabaseKeys
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'attendx-supabase-auth-token',
      }
    })
  : createClient('https://dummy.supabase.co', 'dummy-key');

