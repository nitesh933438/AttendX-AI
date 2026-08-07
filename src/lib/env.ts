// AttendX AI - Environment Variable Validation Layer

export interface EnvConfig {
  nodeEnv: string;
  apiBaseUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  enableAiTelemetry: boolean;
}

export function validateEnv(): EnvConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const enableAiTelemetry = import.meta.env.VITE_ENABLE_AI_TELEMETRY !== 'false';

  return {
    nodeEnv,
    apiBaseUrl,
    supabaseUrl,
    supabaseAnonKey,
    enableAiTelemetry
  };
}

export const env = validateEnv();
