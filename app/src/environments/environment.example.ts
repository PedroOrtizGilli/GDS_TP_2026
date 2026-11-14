// Copiar a environment.ts y reemplazar por los valores del proyecto de Supabase.
// Usar siempre la clave publishable (sb_publishable_...), nunca la secret ni service_role.
export const environment = {
  production: false,
  supabaseUrl: 'https://tu-proyecto.supabase.co',
  supabaseKey: 'sb_publishable_reemplazar',
};
