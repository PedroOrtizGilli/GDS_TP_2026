import { InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * Único lugar de la app que crea el cliente de Supabase. Las credenciales viven
 * en src/environments/environment.ts; los componentes nunca las leen.
 */
export function crearClienteSupabase(): SupabaseClient {
  return createClient(environment.supabaseUrl, environment.supabaseKey);
}

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>('SUPABASE_CLIENT', {
  providedIn: 'root',
  factory: crearClienteSupabase,
});
