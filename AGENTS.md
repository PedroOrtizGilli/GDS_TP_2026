# AGENTS.md

## Qué es este repo

- Proyecto de Gestión de Desarrollo de Software: SDD con OpenCode. `../SPEC.md` es la fuente de verdad; la app Angular vive en `app/`.
- Nada de lo marcado en "No incluye" de la spec (catálogo, stock, clientes, login/roles, conversión de monedas, impuestos, descuentos, facturación, exportación CSV) debe agregarse sin pedido explícito.
- Interfaz, mensajes y documentación en español (es-AR). Montos con `core/formato.ts`, nunca con formatos por defecto.

## Comandos (desde `app/`)

- `npm start` — dev server en http://localhost:4200.
- `npm run build` — build de producción en `dist/app/browser`.
- `npm run build:vercel` — genera `src/environments/environment.ts` desde `SUPABASE_URL`/`SUPABASE_KEY` y compila para Vercel.
- `npm test -- --watch=false` — unitarios con **Vitest** (no Jasmine/Karma); `describe/it/expect/vi`.
- Node >= 22.22.3 / 24.15 / 26 en local. En Vercel se usa Node 24.x.

## Supabase

- Credenciales solo en `src/environments/environment.ts` (gitignoreado); plantilla en `environment.example.ts`. Nunca `service_role` ni la clave secret.
- La tabla `ventas` ya existe: no crear, migrar ni alterar el esquema. Columnas snake_case (`medio_pago`, `creado_en`, `actualizado_en`), líneas en la columna JSON `items`, `total` persistido, `id` de la base, sin login (RLS abierta).
- Todo acceso a datos pasa por `core/ventas.service.ts`. `creado_en`/`actualizado_en` y `total` los calcula la app.

## Arquitectura no obvia

- `VentaList` es dueño de los filtros y los pasa a `ResumenVentas`; el resumen consulta **todo el período** (`listarParaResumen`), no la página visible. Tras eliminar, incrementa `refresco` para recalcularlo.
- Filtros y resumen arrancan con el mes en curso (día 1 al último día). Paginación 10/25/50, 25 por defecto.
- Detalle en modal **solo lectura** con botón Editar; confirmación de borrado con `shared/confirm-dialog`. No se usa el JS de Bootstrap.
- El `id` de la ruta llega al formulario por `withComponentInputBinding` (input `id`), no por lectura manual de `ActivatedRoute`.

## Deploy en Vercel

- Raíz del proyecto: `app/`. Configuración en `vercel.json`: `buildCommand` = `npm run build:vercel`, `outputDirectory` = `dist/app/browser` y rewrite de SPA a `/index.html`.
- Variables en Vercel: `SUPABASE_URL` y `SUPABASE_KEY` (publishable), para Production, Preview y Development.
- `scripts/generar-environment.mjs` genera `src/environments/environment.ts` en el build; el archivo está en `.gitignore`.
- Deploy manual: `npx vercel --prod` desde `app/`. Deploy automático: importar el repo en Vercel con Root Directory = `app`.
- No correr `vercel build` local en `F:`: escribe archivos de más de 64 KB y falla. El deploy normal compila en la nube.

## Tests

- Los unitarios mockean `SUPABASE_CLIENT` (token en `core/supabase.client.ts`).
- La UI usa `data-testid`; cualquier acción nueva que se pruebe debe llevar uno.

## Quirks de este entorno (no revertir sin probar)

- El disco `F:` no acepta escrituras de más de ~64 KB por archivo (`ERROR_FILE_SYSTEM_LIMITATION` / `os error 483`). Si un archivo grande queda truncado (por ejemplo `package-lock.json`), regenerarlo en un directorio de `C:` y copiarlo por bloques de 8 KB con `fs.writeSync`.
- Vercel es el hosting previsto. La publishable queda en el bundle porque es pública por diseño; no cargar información sensible por la RLS abierta.
