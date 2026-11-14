import fs from 'node:fs';
import path from 'node:path';

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_KEY?.trim();

function fallar(mensaje) {
  console.error(`[environment] ${mensaje}`);
  process.exit(1);
}

if (!url) {
  fallar('Falta SUPABASE_URL.');
}

if (!key) {
  fallar('Falta SUPABASE_KEY.');
}

if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
  fallar('SUPABASE_URL no tiene el formato https://<proyecto>.supabase.co.');
}

if (key.includes('service_role') || key.startsWith('sb_secret_')) {
  fallar('SUPABASE_KEY no puede ser service_role ni una clave secret; usá la publishable.');
}

const destino = path.resolve('src/environments/environment.ts');
fs.mkdirSync(path.dirname(destino), { recursive: true });

const contenido = `// Generado por scripts/generar-environment.mjs durante el build de Vercel.
// No editar ni commitear: los valores salen de las variables de entorno.
export const environment = {
  production: true,
  supabaseUrl: ${JSON.stringify(url)},
  supabaseKey: ${JSON.stringify(key)},
};
`;

fs.writeFileSync(destino, contenido, 'utf8');
console.log('[environment] src/environments/environment.ts generado.');
