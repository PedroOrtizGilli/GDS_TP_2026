# Registro de ventas

App Angular 22 para registrar ventas de uso personal, según `../SPEC.md`.

## Requisitos

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` (lo exige Angular CLI 22).
- Una tabla `ventas` existente en Supabase (la app no crea ni modifica el esquema).

## Puesta en marcha

```bash
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
# Completar supabaseUrl y supabaseKey (clave publishable) en environment.ts
npm start
```

La app queda en http://localhost:4200.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/app/browser` |
| `npm run build:vercel` | Genera `environment.ts` desde variables de entorno y compila para Vercel |
| `npm test -- --watch=false` | Tests unitarios (Vitest) |

## Deploy en Vercel

La app se publica desde `app/`, que es la raíz del proyecto en Vercel. La configuración está en `vercel.json`: build `npm run build:vercel`, salida `dist/app/browser` y rewrite de SPA hacia `/index.html` para que las rutas profundas funcionen al recargar.

### Variables de entorno

Configurar en Vercel, para Production, Preview y Development:

- `SUPABASE_URL`
- `SUPABASE_KEY` (siempre la publishable `sb_publishable_...`, nunca `service_role` ni la clave secret)

En el build, `scripts/generar-environment.mjs` escribe `src/environments/environment.ts`. Ese archivo está en `.gitignore` y no se versiona.

### Deploy manual con Vercel CLI

```bash
cd app
npx vercel login
npx vercel link --project registro-ventas
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_KEY production
npx vercel --prod
```

Repetir `vercel env add` para `preview` y `development` si se usan esos entornos.

No ejecutar `vercel build` en el disco `F:`: el build local escribe archivos de más de 64 KB y falla. El deploy normal compila en los servidores de Vercel.

### Deploy automático con GitHub

1. Crear un repositorio en GitHub y subir el proyecto.
2. Importarlo en Vercel.
3. Si el repositorio incluye la raíz `SPEC`, configurar **Root Directory = `app`**.
4. Cargar `SUPABASE_URL` y `SUPABASE_KEY` en Vercel.
5. Deploy. A partir de ahí, cada push a la rama principal publica una versión nueva.

## Estructura

- `src/app/core/` — modelo, formato es-AR, cliente Supabase y `VentasService`.
- `src/app/features/ventas/` — listado con filtros y paginación, resumen, formulario de alta/edición y modal de detalle.
- `src/app/shared/confirm-dialog/` — confirmación de borrado.
- `scripts/generar-environment.mjs` — genera el entorno de Supabase durante el build de Vercel.

## Notas

- ARS y USD se muestran por separado; la app no convierte monedas.
- El detalle es de solo lectura; la edición se hace desde el formulario.
- La clave publishable queda incluida en el bundle porque es pública por diseño. La seguridad de los datos depende de las reglas RLS de Supabase.
