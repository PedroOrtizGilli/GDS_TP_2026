Create or update `AGENTS.md` for this repository.

The goal is a compact instruction file that helps future OpenCode sessions avoid mistakes and ramp up quickly. Every line should answer: "Would an agent likely miss this without help?" If not, leave it out.

User-provided focus or constraints (honor these):


## How to investigate

Read the highest-value sources first:
- `README*`, root manifests, workspace config, lockfiles
- build, test, lint, formatter, typecheck, and codegen config
- CI workflows and pre-commit / task runner config
- existing instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.cursorrules`, `.github/copilot-instructions.md`)
- repo-local OpenCode config such as `opencode.json`

If architecture is still unclear after reading config and docs, inspect a small number of representative code files to find the real entrypoints, package boundaries, and execution flow. Prefer reading the files that explain how the system is wired together over random leaf files.

Prefer executable sources of truth over prose. If docs conflict with config or scripts, trust the executable source and only keep what you can verify.

## What to extract

Look for the highest-signal facts for an agent working in this repo:
- exact developer commands, especially non-obvious ones
- how to run a single test, a single package, or a focused verification step
- required command order when it matters, such as `lint -> typecheck -> test`
- monorepo or multi-package boundaries, ownership of major directories, and the real app/library entrypoints
- framework or toolchain quirks: generated code, migrations, codegen, build artifacts, special env loading, dev servers, infra deploy flow
- testing quirks: fixtures, integration test prerequisites, snapshot workflows, required services, flaky or expensive suites
- important constraints from existing instruction files worth preserving

Good `AGENTS.md` content is usually hard-earned context that took reading multiple files to infer.

## Questions

Only ask the user questions if the repo cannot answer something important. Use the `question` tool for one short batch at most.

Good questions:
- undocumented team conventions
- branch / PR / release expectations
- missing setup or test prerequisites that are known but not written down

Do not ask about anything the repo already makes clear.

## Writing rules

Include only high-signal, repo-specific guidance such as:
- exact commands and shortcuts the agent would otherwise guess wrong
- architecture notes that are not obvious from filenames
- conventions that differ from language or framework defaults
- setup requirements, environment quirks, and operational gotchas
- references to existing instruction sources that matter

Exclude:
- generic software advice
- long tutorials or exhaustive file trees
- obvious language conventions
- speculative claims or anything you could not verify
- content better stored in another file referenced via `opencode.json` `instructions`

When in doubt, omit.

Prefer short sections and bullets. If the repo is simple, keep the file simple. If the repo is large, summarize the few structural facts that actually change how an agent should work.

If `AGENTS.md` already exists at `F:\Universidad\Gestión de Desarrollo de Software\SPEC`, improve it in place rather than rewriting blindly. Preserve verified useful guidance, delete fluff or stale claims, and reconcile it with the current codebase.

I'll start by exploring the repository structure and key configuration files.
+2 commands, 4 thoughts, 3 reads, 2 tools
This is a documentation-only repo — no app code, no manifest, no git, no existing AGENTS.md. The only executable/authoritative source is SPEC.md (a Spanish SDD spec for an Angular + Supabase "Registro de ventas" app that hasn't been scaffolded yet). The PDF/PPTX are course material and sesion-opencode.txt is a PowerShell transcript.
Here's what I would put in AGENTS.md (~35 lines, all verified from the repo):
Proposed content
# AGENTS.md

## What this repo is
- Spec-Driven Development course project (Gestión de Desarrollo de Software).
- `SPEC.md` is the single source of truth. There is no app code, `package.json`,
  lockfile, or git repo yet — the Angular app in the spec is not scaffolded.
- `Open Code.docx.pdf` and `Presentación sobre OpenCode y SDD.pptx` are course
  reference material; `sesion-opencode.txt` is a captured PowerShell transcript.

## Working with the spec
- Implement against requirement IDs (`RF-01`…`RF-11`) and their acceptance
  criteria. If code and spec disagree, the spec wins unless the user changes it.
- Do not add anything under "No incluye" (product catalog, stock, customers,
  login/roles, currency conversion, taxes, discounts, invoicing, CSV export)
  without explicit approval.
- UI copy, validation messages, and new docs stay in Spanish (es-AR):
  dates `dd/mm/aaaa`, amounts two decimals with comma (`4.501,50`).

## Intended stack (per SPEC.md — not installed yet)
- Angular v22, strict TypeScript, reactive forms, Bootstrap.
- Supabase via `@supabase/supabase-js` with the publishable key (`sb_publishable_...`).
  - Credentials only in `src/environments/environment.ts` (`supabaseUrl`,
    `supabaseKey`); commit an `environment.example.ts`. Never read them in components.
  - Never use the secret / `service_role` key. No login: RLS is intentionally open.
  - Table `ventas` already exists. Do not create, migrate or alter schema.
    Columns are snake_case (`medio_pago`, `creado_en`, `actualizado_en`), lines go
    in the JSON `items` column, `id` is DB-generated.
- `total` is persisted (not only computed) because summaries read it.

## Commands
- None exist yet. Don't assume `npm test`, `ng serve`, or lint scripts work until
  the project is scaffolded; check for `package.json` first and use its scripts.
- Deployment target per spec: Vercel.

## Gotchas
- The workspace path contains spaces and accents — quote it in shell commands.
- If OpenCode fails locally with `Database is not empty and has no session table`,
  the workaround recorded in `sesion-opencode.txt` is:
  `$env:OPENCODE_DB = "F:\Universidad\opencode-terminal.db"`.
I left out generic Angular/testing advice, the full data model, and the functional requirements themselves — the spec already covers those, and the file should just point at it.
One thing the repo can't answer:
# Questions
Which language should AGENTS.md be written in?
Spanish (Recommended)
+1 thought
Perfecto. Esta es la versión final en español que escribiría (mismo contenido verificado, nada nuevo):
# AGENTS.md

## Qué es este repo
- Proyecto de la materia Gestión de Desarrollo de Software: ejercicio de Spec-Driven Development.
- `SPEC.md` es la única fuente de verdad. Todavía no hay código de la app, `package.json`, lockfile ni repositorio git: la app Angular descripta en la spec no está creada.
- `Open Code.docx.pdf` y `Presentación sobre OpenCode y SDD.pptx` son material de la materia; `sesion-opencode.txt` es una transcripción de PowerShell.

## Cómo trabajar con la spec
- Implementar contra los IDs de requisito (`RF-01`…`RF-11`) y sus criterios de aceptación. Si el código y la spec no coinciden, manda la spec, salvo que el usuario la cambie.
- No agregar nada de "No incluye" (catálogo de productos, stock, clientes, inicio de sesión/roles, conversión de moneda, impuestos, descuentos, facturación, exportación a CSV) sin aprobación explícita.
- Textos de interfaz, mensajes de validación y documentación nueva en español (es-AR): fechas `dd/mm/aaaa`, montos con dos decimales y coma (`4.501,50`).

## Stack previsto (según SPEC.md, todavía sin instalar)
- Angular v22, TypeScript estricto, formularios reactivos, Bootstrap.
- Supabase con `@supabase/supabase-js` y la clave publishable (`sb_publishable_...`).
  - Las credenciales van solo en `src/environments/environment.ts` (`supabaseUrl`, `supabaseKey`); incluir `environment.example.ts`. Nunca leerlas en los componentes.
  - Nunca usar la clave secret ni `service_role`. Sin login: las reglas RLS quedan abiertas a propósito.
  - La tabla `ventas` ya existe. No crear, migrar ni modificar el esquema. Las columnas van en snake_case (`medio_pago`, `creado_en`, `actualizado_en`), las líneas van en la columna JSON `items` y el `id` lo genera la base.
- `total` se persiste (no solo se calcula) porque el resumen lo lee.

## Comandos
- No hay ninguno todavía. No asumir que `npm test`, `ng serve` o el lint funcionan hasta crear el proyecto; revisar primero si existe `package.json` y usar sus scripts.
- Destino de despliegue según la spec: Vercel.

## Particularidades del entorno
- La ruta del proyecto tiene espacios y acentos: entrecomillarla en los comandos de shell.
- Si OpenCode falla con `Database is not empty and has no session table`, el workaround registrado en `sesion-opencode.txt` es `$env:OPENCODE_DB = "F:\Universidad\opencode-terminal.db"`.
Archivo destino: F:\Universidad\Gestión de Desarrollo de Software\SPEC\AGENTS.md (no existe todavía).
Estoy en modo Plan, así que no puedo crear archivos. Cambiá al agente build (Shift+Tab) y lo escribo tal cual; si querés ajustar algo —por ejemplo, sacar el gotcha de OPENCODE_DB o acortar el bloque de Supabase— decime y lo corrijo antes.
Plan · DeepSeek V4.1 Flash Free · 1m 29s · 101.6 tok/s · 2.6s ttft
Switched agent from Plan to Build
Switched agent from Build to Plan
Leé @SPEC.md y @AGENTS.md. Proponé un plan de implementación en pasos
ordenados. Para cada paso indicá qué archivos se crean o modifican y qué
requisitos (RF-xx) cubre. No incluyas nada que figure en "No incluye".
Si algo de la spec es ambiguo, listalo como pregunta en vez de decidirlo.
No modifiques archivos. 
+2 thoughts, 1 read, 1 tool
AGENTS.md todavía no existe: quedó pendiente porque la sesión anterior terminó en modo Plan. No lo creé ahora porque pediste no modificar archivos. El plan no depende de él; cuando estés en modo build lo genero y lo dejo alineado con este plan.
Supuestos de partida
- Angular 22 standalone (archivos sin sufijo .component), TypeScript estricto, formularios reactivos, signals para estado.
- Bootstrap solo CSS (sin ng-bootstrap), modales con markup propio.
- El modelo usa los nombres snake_case de la tabla (medio_pago, creado_en, actualizado_en, items) para no mapear.
- No se crea ni modifica el esquema de Supabase (tabla ventas ya existente) y no hay login.
Plan de implementación
Paso 1 — Andamiaje del proyecto (sin RF directo; base de todo)
- Crear: package.json, angular.json, tsconfig*.json, src/main.ts, src/index.html, src/styles.scss, src/app/app.ts, app.html, app.config.ts, app.routes.ts, .gitignore, public/.
- Instalar bootstrap y @supabase/supabase-js; importar Bootstrap en styles.scss; registrar locale es-AR en app.config.ts.
Paso 2 — Entorno y cliente Supabase (restricciones de claves/seguridad)
- Crear: src/environments/environment.ts, src/environments/environment.example.ts, src/app/core/supabase.client.ts (único lugar con createClient).
- Modificar: .gitignore para excluir environment.ts.
Paso 3 — Modelo, constantes y formato (RF-01, RF-02, RF-05, RF-11 en cuanto a formato)
- Crear: src/app/core/models/venta.ts (Venta, ItemVenta, MedioPago, Moneda, FiltrosVenta), src/app/core/medios-pago.ts (lista fija), src/app/core/formato.ts (moneda/fecha es-AR).
Paso 4 — Servicio de datos (RF-01, RF-02, RF-06, RF-07, RF-09, RF-10)
- Crear: src/app/core/ventas.service.ts con listar(filtros), obtener(id), crear, actualizar, eliminar.
- Orden fecha descendente, ilike para cliente, rango de fechas, eq para medio de pago y moneda; setea creado_en/actualizado_en y persiste total recalculado.
Paso 5 — Shell, rutas y navegación (RF-06, RF-08, RF-09)
- Modificar: src/app/app.routes.ts (/ventas, /ventas/nueva, /ventas/:id, /ventas/:id/editar), app.html/app.ts (navbar y router-outlet).
Paso 6 — Listado con filtros (RF-06, RF-07)
- Crear: src/app/features/ventas/venta-list/venta-list.ts|.html|.css.
- Tabla responsive, formulario de filtros combinables, estados carga/vacío/error, acciones ver/editar/eliminar.
Paso 7 — Resumen del período (RF-11)
- Crear: src/app/features/ventas/resumen-ventas/resumen-ventas.ts|.html|.css.
- Cantidad de ventas y total vendido por moneda (ARS y USD nunca combinados) y por medio de pago; por defecto mes en curso; se recalcula con los filtros.
Paso 8 — Formulario de alta y edición (RF-01, RF-02, RF-03, RF-04, RF-05, RF-09)
- Crear: src/app/features/ventas/venta-form/venta-form.ts|.html|.css.
- FormGroup + FormArray de líneas, fecha por defecto hoy, select de medio de pago y moneda, validaciones del RF-04, subtotales y total en vivo, mensajes de error en español, misma pantalla para alta y edición.
Paso 9 — Detalle de venta (RF-08)
- Crear: src/app/features/ventas/venta-detail/venta-detail.ts|.html|.css (o modal, según la pregunta 2). Muestra datos, líneas, descripción y total.
Paso 10 — Eliminación con confirmación (RF-10)
- Crear: src/app/shared/confirm-dialog/confirm-dialog.ts|.html|.css.
- Modificar listado y detalle para confirmar, eliminar y refrescar listado + resumen.
Paso 11 — Responsive y verificación de aceptación (criterios de aceptación de todos los RF)
- Modificar plantillas/estilos para 360 px sin scroll horizontal; verificar los 13 criterios de la spec y corregir desvíos.
Paso 12 — Condicional, según respuestas
- Tests *.spec.ts (servicio, validaciones del formulario, agrupación del resumen) y configuración de Vercel (vercel.json).
Dependencia clave: si se confirma paginación (pregunta 1), el resumen del Paso 7 no puede calcularse sobre las filas visibles y necesita una consulta de agregación aparte.
Preguntas abiertas (no las decido)
1. Paginación: la spec la deja en "Puntos abiertos". ¿Entra en esta versión o el listado trae todo?
2. Detalle (RF-08): ¿página propia, modal o fila expandible? ¿Es solo lectura?
3. Filtros iniciales del listado: ¿arranca sin rango (todas las ventas) o con el mes en curso, como el resumen del RF-11?
4. Tests: ¿se esperan tests automatizados? La spec no los menciona ni define framework.
5. Deploy: ¿Vercel es parte del entregable o solo está previsto como hosting?
6. Ubicación: ¿el proyecto Angular va en la raíz SPEC\ o en una subcarpeta (por ejemplo app\)?
Prerrequisitos
- URL y clave publishable (sb_publishable_...) del proyecto Supabase.
- Confirmar con un registro real los tipos de fecha, creado_en, actualizado_en y los valores almacenados en medio_pago (la spec solo lista las etiquetas).
- Node/npm compatibles con Angular 22.
Cuando cambies a modo build, escribo AGENTS.md y arranco por el Paso 1 con las respuestas que me des.
Plan · DeepSeek V4.1 Flash Free · 1m 30s · 92.9 tok/s · 1.3s ttft
1. La paginación entra en esta verión.
2. Modal.
3. Arranca con el mes en curso iggual que RF-11.
4. Si.
5. Vercel esta previsto como hosting unicamente.
6. En una subcarpeta.

Prerrequisitos.
La URL y clave publishable las voy a introducir yo una vez este creado el archivo.

Si algo sigue ambiguo, listalo como pregunta en vez de decidirlo.
+1 thought
Anotado. Plan actualizado (sin tocar archivos todavía). Los cambios respecto del anterior están marcados con (actualizado).
Decisiones incorporadas
- Paginación en v1 → listado paginado en el servidor y resumen en consulta aparte.
- Detalle en modal, sin ruta propia.
- Filtros del listado arrancan con el mes en curso, igual que el resumen.
- Tests automatizados incluidos.
- Vercel solo previsto: sin vercel.json ni paso de deploy.
- Proyecto Angular en subcarpeta.
Plan de implementación
Paso 0 — AGENTS.md (sin RF)
- Crear: AGENTS.md en la raíz, con la subcarpeta, los comandos reales del CLI y las restricciones de Supabase.
Paso 1 — Andamiaje (base de todo)
- Crear en <subcarpeta>/: package.json, angular.json, tsconfig*.json, src/main.ts, src/index.html, src/styles.scss, src/app/{app.ts,app.html,app.config.ts,app.routes.ts}, .gitignore, public/.
- Instalar bootstrap, @supabase/supabase-js, locale es-AR en app.config.ts.
Paso 2 — Entorno y cliente Supabase (restricciones de claves)
- Crear: src/environments/environment.ts (con placeholders para que los completes), environment.example.ts, src/app/core/supabase.client.ts.
- Modificar: .gitignore para excluir environment.ts.
Paso 3 — Modelo, constantes y formato (RF-01, RF-02, RF-05, RF-11 formato)
- Crear: src/app/core/models/venta.ts, src/app/core/medios-pago.ts, src/app/core/formato.ts.
Paso 4 — Servicio de datos (RF-01, RF-02, RF-06, RF-07, RF-09, RF-10)
- Crear: src/app/core/ventas.service.ts: listar(filtros, pagina, tamanoPagina), contar(filtros), obtener, crear, actualizar, eliminar.
- range() + count: 'exact', orden fecha desc con desempate por creado_en desc; total recalculado y persistido.
Paso 5 — Shell, rutas y navegación (RF-06, RF-09) (actualizado)
- Rutas: /ventas, /ventas/nueva, /ventas/:id/editar (sin ruta de detalle). Navbar y router-outlet.
Paso 6 — Listado con filtros y paginación (RF-06, RF-07) (actualizado)
- Crear: src/app/features/ventas/venta-list/venta-list.ts|.html|.css.
- Filtros por rango de fechas (mes en curso por defecto), cliente parcial, medio de pago y moneda; controles de página y total de resultados; al cambiar filtros vuelve a la página 1.
Paso 7 — Resumen del período (RF-11) (actualizado)
- Crear: src/app/features/ventas/resumen-ventas/resumen-ventas.ts|.html|.css.
- Consulta de agregación propia sobre todo el período filtrado (no sobre la página visible): cantidad de ventas, totales ARS y USD separados y desglose por medio de pago.
Paso 8 — Formulario de alta y edición (RF-01 a RF-05, RF-09)
- Crear: src/app/features/ventas/venta-form/venta-form.ts|.html|.css.
- FormArray de líneas, fecha hoy por defecto, select de medio de pago y moneda, validaciones del RF-04, subtotales y total en vivo, mensajes en español.
Paso 9 — Detalle en modal (RF-08) (actualizado)
- Crear: src/app/features/ventas/venta-detail-modal/venta-detail-modal.ts|.html|.css.
- Se abre desde el listado; muestra datos, líneas, descripción y total.
Paso 10 — Eliminación con confirmación (RF-10)
- Crear: src/app/shared/confirm-dialog/...; usar en listado y detalle; refrescar listado y resumen tras borrar.
Paso 11 — Responsive y verificación de aceptación (criterios de todos los RF)
- Ajustes a 360 px sin scroll horizontal y repaso de los 13 criterios.
Paso 12 — Tests (verificación de RF-01 a RF-11) (actualizado)
- *.spec.ts de: ventas.service (con cliente Supabase mockeado, sin credenciales reales), venta-form (validaciones y subtotales), resumen-ventas y lógica de filtros/paginación.
- Sin archivos de deploy.
Preguntas que siguen abiertas
1. Nombre de la subcarpeta: ¿app/, frontend/, registro-ventas/ u otro?
2. Tamaño de página: ¿10, 20, 25? ¿Fijo o seleccionable por el usuario?
3. Modal de detalle: ¿solo lectura con un botón "Editar", o editable dentro del mismo modal?
4. Tests: ¿alcanza con unitarios del CLI (servicio, formulario, resumen) o también se esperan E2E de los criterios de aceptación? Si sí, ¿Playwright o Cypress?
5. Rango por defecto del mes: ¿del 1º del mes hasta hoy, o hasta el último día del mes?
Prerrequisitos
- La URL y la clave publishable las cargás vos en environment.ts después del Paso 2; hasta entonces uso placeholders y los tests no dependen de Supabase real.
- Verificar contra la tabla existente los tipos de fecha, creado_en y actualizado_en y los valores guardados en medio_pago.
Con las respuestas 1 a 5 cierro el plan; después cambiá a modo build y arranco por el Paso 0.
Plan · DeepSeek V4.1 Flash Free · 37.2s · 93.4 tok/s · 4.3s ttft
1. app/
2. Seleccionable por el usuario.
3. Solo lectura con el boton editar.
4. Se esperan unitarios y E2E con Playwright.
5. Del 1° hasta el último día del mes.
+1 thought
Plan casi cerrado. Incorporo todo y quedan dos preguntas puntuales.
Decisiones incorporadas
- Subcarpeta app/ (el AGENTS.md queda en la raíz).
- Tamaño de página seleccionable por el usuario.
- Modal de detalle solo lectura, con botón "Editar".
- Unitarios + E2E con Playwright.
- Rango por defecto: 1º al último día del mes en curso.
Plan final
Paso 0 — AGENTS.md (sin RF)
- Crear AGENTS.md en la raíz: subcarpeta app/, comandos reales (dev, unitarios, E2E), restricciones de Supabase.
Paso 1 — Andamiaje (base)
- En app/: package.json, angular.json, tsconfig*.json, src/main.ts, src/index.html, src/styles.scss, src/app/{app.ts,app.html,app.config.ts,app.routes.ts}, .gitignore, public/.
- Dependencias: bootstrap, @supabase/supabase-js, Playwright como devDependency; locale es-AR.
Paso 2 — Entorno y cliente Supabase
- Crear app/src/environments/environment.ts (placeholders que completás vos), environment.example.ts, app/src/app/core/supabase.client.ts.
- .gitignore: excluir environment.ts.
Paso 3 — Modelo, constantes y formato (RF-01, RF-02, RF-05, RF-11 formato)
- app/src/app/core/models/venta.ts, core/medios-pago.ts, core/formato.ts.
Paso 4 — Servicio de datos (RF-01, RF-02, RF-06, RF-07, RF-09, RF-10)
- app/src/app/core/ventas.service.ts: listar(filtros, pagina, tamano), contar(filtros), obtener, crear, actualizar, eliminar.
- range() + count: 'exact'; orden fecha desc, desempate creado_en desc; total recalculado y persistido; creado_en/actualizado_en desde la app.
Paso 5 — Shell y rutas (RF-06, RF-09)
- Rutas /ventas, /ventas/nueva, /ventas/:id/editar; navbar y router-outlet.
Paso 6 — Listado con filtros y paginación (RF-06, RF-07)
- app/src/app/features/ventas/venta-list/venta-list.ts|.html|.css.
- Filtros combinables con mes en curso por defecto, selector de tamaño de página, navegación de páginas y total de resultados; volver a página 1 al filtrar.
Paso 7 — Resumen del período (RF-11)
- app/src/app/features/ventas/resumen-ventas/....
- Agregación sobre todo el período filtrado, independiente de la página: cantidad, totales ARS y USD separados, desglose por medio de pago.
Paso 8 — Formulario de alta y edición (RF-01 a RF-05, RF-09)
- app/src/app/features/ventas/venta-form/...: FormArray, fecha hoy, selects, validaciones del RF-04, subtotales y total en vivo, mensajes en español.
Paso 9 — Modal de detalle (RF-08)
- app/src/app/features/ventas/venta-detail-modal/...: solo lectura, con acción "Editar".
Paso 10 — Eliminación con confirmación (RF-10)
- app/src/app/shared/confirm-dialog/...; refresca listado y resumen tras borrar.
Paso 11 — Responsive y verificación manual (criterios de aceptación)
- 360 px sin scroll horizontal; repaso de los 13 criterios.
Paso 12 — Unitarios (verificación RF-01 a RF-11)
- *.spec.ts de ventas.service (cliente Supabase mockeado), venta-form, resumen-ventas y lógica de filtros/paginación. environment.ts con placeholders no debe romper los tests.
Paso 13 — E2E con Playwright (criterios de aceptación RF-01 a RF-11)
- app/playwright.config.ts con webServer apuntando a ng serve.
- app/e2e/*.spec.ts: alta con dos líneas, subtotales/total, validaciones, filtros combinados, orden, detalle, edición, baja confirmada/cancelada, resumen ARS/USD y vista 360 px.
- Sin archivos de deploy (Vercel queda solo previsto).
Preguntas restantes
1. Opciones de tamaño de página: ¿qué valores y cuál por defecto? Por ejemplo 10/25/50 con 25 por defecto.
2. Datos en los E2E: ¿corren contra el Supabase real, creando y borrando ventas de prueba, o con la red interceptada (page.route) usando fixtures? Lo pregunto porque contra el Supabase real los tests escriben en tu tabla y necesitan las credenciales ya cargadas.
Con esas dos respuestas el plan queda cerrado. Después pasá a modo build y arranco por el Paso 0.
Plan · DeepSeek V4.1 Flash Free · 22.8s · 105.1 tok/s · 1.9s ttft
1. 10//25/50 con 25 por defecto.
2. Con la red interceptada.
+1 thought
Plan cerrado. Incorporo las dos últimas definiciones:
- Paginación: selector con 10 / 25 / 50, valor inicial 25.
- E2E: sin Supabase real. Playwright intercepta las llamadas REST a ventas con page.route y fixtures, así que los tests no necesitan credenciales y no escriben en tu tabla.
Consecuencia práctica: los Pasos 12 y 13 quedan desacoplados de Supabase, y environment.ts puede seguir con placeholders durante todo el desarrollo hasta que cargues la URL y la clave.
Resumen del plan (14 pasos):
Paso	Entrega	RF
0	AGENTS.md en la raíz	—
1	Andamiaje Angular 22 en app/	base
2	Entornos + cliente Supabase	—
3	Modelo, medios de pago, formato es-AR	RF-01/02/05, formato RF-11
4	ventas.service (CRUD, filtros, paginación)	RF-01/02/06/07/09/10
5	Shell y rutas	RF-06/09
6	Listado con filtros y paginación	RF-06/07
7	Resumen del período	RF-11
8	Formulario alta/edición	RF-01 a RF-05, RF-09
9	Modal de detalle (solo lectura)	RF-08
10	Baja con confirmación	RF-10
11	Responsive + verificación manual	criterios
12	Unitarios	verificación
13	E2E Playwright con red interceptada	criterios
No queda nada ambiguo pendiente. No modifiqué archivos: sigo en modo Plan, así que para que empiece a crear AGENTS.md y el andamiaje necesitás cambiar al agente build (Shift+Tab). Decime "dale" y arranco por el Paso 0.
Plan · DeepSeek V4.1 Flash Free · 8.6s · 99.3 tok/s · 1.5s ttft
Switched agent from Plan to Build
Dale
+3 commands, 3 thoughts
Voy a arrancar con el andamiaje (Paso 1), porque los comandos reales condicionan el AGENTS.md.
+1 command, 1 thought
Node local es 22.20.0 y el CLI 22.2.7 exige 22.22.3+. Busco la última versión de Angular 22 compatible sin tocar tu Node.
+1 command, 1 thought
Angular 22 exige Node 22.22.3+/24.15+. Voy a usar un Node portátil solo para este proyecto, sin modificar tu instalación.
+4 commands, 5 thoughts, 5 reads
Andamiaje listo (Angular 22.2, Vitest, TS 6). Verifico que compile antes de empezar a escribir código.
+2 commands, 2 thoughts, 4 reads
Base compilando y tests funcionando. Ahora escribo el núcleo (modelo, formato, servicio, configuración).
+1 command, 33 edits, 8 thoughts, 2 reads
Compila. Ahora los tests unitarios (Vitest) de lógica y servicio.
+2 commands, 8 edits, 3 thoughts
24 tests unitarios en verde. Instalo Chromium para Playwright mientras escribo los E2E.
+1 command, 3 edits, 1 thought
↳ Shell finished · $env:PATH = "C:\Users\Pedro\AppData\Local\Temp\opencode\node26;$env:PATH"; npx playwright ins…
+6 commands, 3 edits, 11 thoughts, 3 reads, 1 tool
El dev server falla al escribir su caché de Vite en la ruta con acentos. Desactivo el prebundle de dependencias (el build normal ya funciona).
+2 commands, 2 edits, 2 thoughts
El dev server ya arranca. Los tests fallan solo al escribir los traces de Playwright en este disco; los desactivo.
+1 command, 1 edit, 1 thought
10/10 E2E en verde. Limpio un tipo duplicado y escribo la documentación (AGENTS.md y README).
+2 commands, 4 edits, 4 thoughts
No se pueden crear archivos nuevos en la raíz SPEC (falla el disco), aunque app/ sí funciona. Verifico el alcance.
+3 commands, 1 edit, 3 thoughts
El directorio raíz SPEC rechaza cualquier archivo nuevo (incluso con \\?\), aunque app/ sí acepta escrituras. Dejo AGENTS.md dentro de app/, que es donde vive el proyecto.
+4 commands, 1 edit, 4 thoughts
Todo en verde. Sincronizo el lockfile con el nuevo nombre/engines y reviso el árbol final.
+1 command, 2 thoughts, 1 read, 1 tool, 1 instruction
El lockfile quedó truncado por el mismo error de escritura del disco. Lo regenero desde cero.
+5 commands, 5 thoughts
Hallazgo: el disco rechaza escribir archivos de más de ~64 KB. Pruebo mover el lockfile ya generado desde otra carpeta en lugar de reescribirlo.
+7 commands, 1 edit, 7 thoughts, 1 read, 1 tool
Listo. Implementé la app completa en app/ y verifiqué todo.
Qué quedó hecho
- Andamiaje: Angular 22.2 (standalone, zoneless, TS estricto), Vitest, Bootstrap CSS, @supabase/supabase-js, Playwright.
- Núcleo: core/models/venta.ts, core/medios-pago.ts, core/formato.ts (es-AR), core/resumen.ts, core/paginacion.ts, core/validadores.ts, core/supabase.client.ts, core/ventas.service.ts.
- Funcionalidad: listado con filtros combinables y paginación 10/25/50 (25 por defecto), resumen por período con ARS/USD separados y desglose por medio de pago, alta/edición con FormArray, validaciones del RF-04, subtotales y total en vivo, detalle en modal de solo lectura y baja con confirmación.
- Tests: 6 archivos unitarios (24 tests) y 10 E2E con backend falso interceptado; cobertura de RF-01 a RF-11 y del ancho de 360 px.
- Docs: app/AGENTS.md y app/README.md con comandos, restricciones de Supabase y los problemas del disco.
Verificación
Chequeo	Resultado
npm test -- --watch=false	24/24
npm run e2e	10/10
npm run build	OK (app/dist/app)
Para ejecutarla
Tu Node es 22.20.0 y Angular 22 exige 22.22.3+. Usé uno portátil; podés repetir:
$env:PATH = "C:\Users\Pedro\AppData\Local\Temp\opencode\node26;$env:PATH"
cd app
npm start
Después completá app/src/environments/environment.ts con supabaseUrl y tu clave publishable. Los tests no necesitan credenciales.
Dos avisos sobre el disco
1. AGENTS.md quedó en app/, no en la raíz: el directorio SPEC rechaza crear cualquier archivo nuevo (os error 483). Conviene correr chkdsk F: /f o mover el repo a C:.
2. El disco no acepta escrituras de más de ~64 KB: por eso desactivé el cache de Angular y el prebundle en angular.json, y trace/screenshot/video en Playwright. También tuve que regenerar package-lock.json por bloques. Está documentado en app/AGENTS.md.
No creé archivos de deploy (Vercel quedó solo como hosting previsto) ni toqué el esquema de Supabase, según lo acordado.
Build · DeepSeek V4.1 Flash Free · 23m 19s · 112.3 tok/s · 1.3s ttft
1. Yo me ocupo de mover el archivo a la raiz.
2. Dale.

Ya cargue la URL y publishable a environments. No olvides que envinornments tiene que estar en .gitignore. Podes hacer las pruebas y conexion a supabase.
+1 thought
Perfecto. Verifico primero que las credenciales estén cargadas (sin imprimirlas) y que environment.ts siga ignorado.
+2 commands, 2 thoughts
Ahora pruebo la conexión real, en modo lectura primero y con un alta/baja de prueba controlada después (para validar el contrato real de la tabla).
+1 command, 1 edit, 1 thought
Conexión y CRUD reales OK (tabla vacía). Ahora un smoke test de la UI contra Supabase real, creando y borrando una venta marcada, con limpieza garantizada.
+2 commands, 1 edit, 2 thoughts
Todo verificado contra tu Supabase real.
Resultados
Prueba	Resultado
Unitarios (Vitest)	24/24
E2E con backend falso (Playwright)	10/10
Conexión Supabase (publishable key)	OK
Alta + lectura + baja vía supabase-js	OK
Recorrido completo por la UI contra Supabase real	OK
Detalle del smoke test real: creé una venta desde la UI con 2 × 1.234,50, la lista la mostró como 2.469,00, el modal de detalle mostró el total correcto, y la eliminé desde la propia app. Sin errores de consola ni alertas. Al terminar, la tabla quedó con 0 filas, igual que al empezar.
También confirmé que src/environments/environment.ts está en .gitignore:
/src/environments/environment.ts
Observaciones
- La tabla ventas está vacía. Por eso no pude verificar los valores ya guardados en medio_pago ni inferir tipos desde filas existentes; el alta real sí validó que las columnas aceptan el payload de la app (fecha, items JSON, total, timestamps, id autogenerado).
- No modifiqué el esquema ni dejé datos de prueba. Borré los scripts temporales de verificación.
- Para correr la app te sigue haciendo falta Node >= 22.22.3 (tu instalación es 22.20.0). Con el portable:
$env:PATH = "C:\Users\Pedro\AppData\Local\Temp\opencode\node26;$env:PATH"
cd app
npm start
Cuando muevas AGENTS.md a la raíz, avisame si querés que ajuste los enlaces relativos (../SPEC.md, app/...) para que sigan siendo correctos desde arriba.
Build · DeepSeek V4.1 Flash Free · 2m 36s · 106.3 tok/s · 2.8s ttft
No voy a poder mover AGENTS.md.
+1 thought
Veamos si el problema es del directorio y no del archivo. Pruebo escribir en la raíz a través de un junction (sin tocar tus archivos).
+1 command, 1 thought
Build · DeepSeek V4.1 Flash Free · 50.7s · 71.6 tok/s · 2.6s ttft · interrupted
Switched agent from Build to Plan
Revisá la implementación contra la tabla de criterios de aceptación de
@SPEC.md. Para cada criterio decí si se cumple y qué evidencia hay en el
código. No modifiques nada todavía. 
+1 thought
Voy a contrastar cada criterio con el código real y los tests. Leo los archivos clave (solo lectura).
+4 reads
Compaction· 177.6K in · 2.0K out
Objective
- Revisar la implementación de la app Angular "Registro de ventas" contra la tabla de criterios de aceptación de SPEC.md, indicando para cada criterio si se cumple y qué evidencia hay en el código, sin modificar nada.
Requirements
- No modificar archivos: la revisión es solo lectura.
- Para cada criterio de aceptación: decir si se cumple y citar evidencia en el código.
- No incluir nada de la sección "No incluye" de la spec.
- Si algo es ambiguo, listarlo como pregunta en vez de decidirlo (aplicado antes en el plan).
- Interfaz y documentación en español (es-AR); montos con coma decimal y fechas dd/mm/aaaa.
- Vercel es solo hosting previsto; no crear archivos de deploy.
- environment.ts debe estar en .gitignore.
- El usuario se ocupa de mover AGENTS.md; luego dijo que no podrá hacerlo.
Decisions
- App en subcarpeta app/; Angular 22.2 standalone, zoneless, signals, Vitest, Playwright.
- Paginación en v1, selector 10/25/50 con 25 por defecto.
- Detalle en modal solo lectura con botón Editar; borrado con diálogo de confirmación propio (sin JS de Bootstrap).
- Filtros y resumen arrancan con el mes en curso (día 1 al último día).
- Resumen consulta todo el período filtrado aparte de la página visible.
- E2E con red interceptada (e2e/supabase-falso.ts), sin Supabase real ni credenciales.
- Tests unitarios + E2E con Playwright.
- Se desactivaron cache de Angular y prebundle de Vite, y trace/screenshot/video de Playwright, por limitaciones del disco F:.
- AGENTS.md quedó en app/AGENTS.md porque la raíz SPEC no acepta crear archivos.
Work State
Completed
- App completa implementada y verificada: listado con filtros/paginación, resumen, alta/edición, detalle modal, baja con confirmación.
- 24 tests unitarios pasando; 10 E2E pasando; npm run build OK.
- Conexión real a Supabase verificada (lectura y alta/baja controlada); smoke test de UI contra Supabase real OK, sin dejar filas.
- environment.ts cargado con URL y clave publishable; confirmado en .gitignore (/src/environments/environment.ts).
- AGENTS.md y README.md creados en app/.
Active
- Revisión de los 11 criterios de aceptación contra el código, con evidencia (lectura de venta-form.ts, venta-form.html, venta-list.ts, ventas.service.ts; faltan resumen, modal, listado HTML, tests y formato.ts).
- Pendiente resolver dónde dejar AGENTS.md: el usuario no puede moverlo a la raíz. Se probó junction desde C:\Users\Pedro\AppData\Local\Temp\opencode\spec-link y también falló con UNKNOWN; OpenCode ya carga app/AGENTS.md (aparece como instrucciones del proyecto).
Blocked
- Crear archivos en la raíz F:\Universidad\Gestión de Desarrollo de Software\SPEC: falla con os error 483 / ERROR_FILE_SYSTEM_LIMITATION. También falla escribir archivos de más de ~64 KB en cualquier ruta del disco F:.
- Mover AGENTS.md a la raíz: bloqueado por el mismo error (el usuario confirmó que no podrá hacerlo).
Next Move
1. Completar la revisión leyendo resumen-ventas.ts/.html, venta-detail-modal.html, venta-list.html, e2e/ventas.spec.ts, core/formato.ts, core/validadores.ts y core/paginacion.ts.
2. Entregar tabla criterio por criterio (RF-01/RF-02, RF-03, RF-04, RF-05, RF-06, RF-07, RF-08, RF-09, RF-10, RF-11 y "General") con estado y evidencia (archivo:línea o test).
3. Señalar coberturas parciales honestas: "sin líneas" se evita deshabilitando quitar la última línea; persistencia tras cerrar navegador no está en E2E (sí verificada contra Supabase real); resumen tras editar no tiene aserción E2E explícita.
4. No modificar archivos.
Relevant Files
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\SPEC.md: fuente de verdad y tabla de criterios de aceptación (líneas 70-83).
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\features\ventas\venta-form\venta-form.ts: validaciones, total/subtotales, guardar, edición.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\features\ventas\venta-form\venta-form.html: mensajes de error, selects de medio de pago/moneda, total en pantalla.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\features\ventas\venta-list\venta-list.ts: filtros, paginación, borrado, refresco del resumen.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\features\ventas\venta-list\venta-list.html: tabla, filtros, paginación, modales.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\features\ventas\resumen-ventas\resumen-ventas.ts: recálculo del resumen por filtros/refresco.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\features\ventas\resumen-ventas\resumen-ventas.html: totales ARS/USD separados y desglose por medio.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\features\ventas\venta-detail-modal\venta-detail-modal.html: detalle con líneas, descripción y total.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\core\ventas.service.ts: orden fecha/creado_en desc, filtros ilike/eq/gte/lte, CRUD y total persistido.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\src\app\core\resumen.ts: resumirVentas, ARS y USD nunca combinados.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\e2e\ventas.spec.ts: 10 E2E que cubren criterios y 360 px.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\e2e\supabase-falso.ts: backend falso que intercepta **/rest/v1/ventas*.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\AGENTS.md: instrucciones ya cargadas; el usuario no puede moverlo a la raíz.
- F:\Universidad\Gestión de Desarrollo de Software\SPEC\app\angular.json: cache y prebundle desactivados por el error de disco.
Important Context
- Comandos verificados desde app/: npm start, npm run build (salida app/dist/app), npm test -- --watch=false (Vitest), npm run e2e (Playwright; Chromium ya instalado).
- Node del sistema es 22.20.0 y Angular 22 exige >=22.22.3; se usó Node portátil en C:\Users\Pedro\AppData\Local\Temp\opencode\node26.
- El disco F: devuelve UNKNOWN/483 al escribir >64 KB; package-lock.json se restauró con escritura por bloques de 8 KB desde un lock generado en C:.
- La tabla ventas estaba vacía; el alta/baja real validó columnas y tipos, pero no se pudieron verificar valores existentes de medio_pago.
- No hay repositorio git inicializado.
- Quedó un junction temporal en C:\Users\Pedro\AppData\Local\Temp\opencode\spec-link apuntando a SPEC; no se limpió por estar en modo Plan.
+9 thoughts, 24 reads, 1 instruction
Revisé SPEC.md:70-83 contra el código, sin modificar nada. Resultado criterio por criterio:
Criterio	Estado	Evidencia en el código
RF-01, RF-02 — alta con dos líneas y datos generales	Cumple (con matiz)	Formulario con fecha por defecto hoy, cliente, medio, moneda y descripción: venta-form.ts:33-40 y venta-form.html:16-85. Agregar/quitar líneas: venta-form.ts:86-95, botón en venta-form.html:92-99. Guardado real: venta-form.ts:107-144 → ventas.service.ts:95-120. Listado: venta-list.html:118-124. E2E: e2e/ventas.spec.ts:148-190 crea dos líneas, valida el POST con ambos ítems y que la venta aparezca al filtrar.
RF-03 — subtotal y total en vivo	Cumple	Cálculo: formato.ts:45-51; estado reactivo venta-form.ts:43-44; subtotal por línea venta-form.ts:97-100; render venta-form.html:172-174 y total 194-196. E2E: ventas.spec.ts:157-168 verifica 3 × 1500,50 = 4.501,50 y total 4.701,50 USD. Unitario: formato.spec.ts.
RF-04 — validaciones antes de guardar	Cumple	Validadores validadores.ts:4-13; definición venta-form.ts:33-40,146-152; bloqueo y marcado venta-form.ts:107-114; mensajes por campo en venta-form.html:26-28, 41-45, 102-106, 123-125, 142-146, 163-167. E2E: ventas.spec.ts:192-210 (cliente vacío, cantidad 0, precio −1, sin POST). Unitario: venta-form.spec.ts.
RF-05 — medio de pago de lista fija	Cumple	Lista cerrada medios-pago.ts:3-8; tipo MedioPago en models/venta.ts:3; <select> generado desde esa lista en venta-form.html:50-59 (no hay input de texto). E2E usa selectOption('transferencia'): ventas.spec.ts:153.
RF-06 — orden fecha descendente	Cumple	ventas.service.ts:37-41: .order('fecha', { ascending: false }) y desempate por creado_en. E2E: ventas.spec.ts:74-83 verifica que la primera fila sea la más reciente.
RF-07 — filtros por fecha, cliente, medio y moneda	Cumple	UI venta-list.html:8-85; defaults del mes en curso venta-list.ts:41-47; recarga al cambiar filtros venta-list.ts:66-71; consulta combinada ventas.service.ts:20-35 (gte, lte, ilike, eq). E2E: ventas.spec.ts:100-117 combina cliente/medio/moneda; rango de fechas cubierto por unitario de servicio y por los defaults (ventas.spec.ts:92-98).
RF-08 — detalle con todas las líneas, descripción y total	Cumple	Modal venta-detail-modal.html:22-72: datos generales, descripción condicional (36-39), líneas (53-61) y total (63-70). E2E: ventas.spec.ts:214-228 verifica línea y total.
RF-09 — editar y que listado/resumen reflejen el cambio	Cumple (cobertura E2E parcial)	Carga para editar venta-form.ts:52-84; guarda con actualizar venta-form.ts:132-137 → ventas.service.ts:122-135 (recalcula total). E2E: ventas.spec.ts:230-251 edita, valida PATCH y el listado actualizado. El resumen se recalcula por filtros/refresco (resumen-ventas.ts:28-32), pero ningún E2E afirma el resumen después de editar.
RF-10 — eliminar con confirmación	Cumple (cobertura E2E parcial)	Flujo venta-list.ts:114-136; diálogo confirm-dialog.html:1-45; al confirmar incrementa refresco (venta-list.ts:130) para recalcular el resumen. E2E: ventas.spec.ts:253-271 valida que cancelar no emite DELETE y que confirmar baja el total a 29 y quita la fila. No se afirma en E2E que el resumen baje, aunque el código lo fuerza.
RF-11 — resumen del período con ARS/USD separados	Cumple	Agrupación sin mezclar monedas resumen.ts:35-61; consulta de todo el período, no solo la página ventas.service.ts:50-78; render con totales ARS/USD y desglose por medio resumen-ventas.html:13-61. E2E: ventas.spec.ts:121-144 compara ambos totales y el desglose. Default mes en curso: venta-list.ts:41-47.
General — 360 px	Cumple	Tabla envuelta en .table-responsive (venta-list.html:94) y grillas Bootstrap; E2E a 360 px sin desborde: ventas.spec.ts:274-287.
General — persistencia al cerrar/reabrir	Cumple por diseño (sin test automático)	Todo se guarda en Supabase (ventas.service.ts:95-143) y cada carga vuelve a consultar (venta-list.ts:73). Se verificó con CRUD real y smoke test de UI contra el proyecto, pero no hay E2E que cierre y reabra el navegador.
Matices que conviene tener presentes
1. RF-01/RF-02: el listado no muestra las líneas, solo los datos generales y el total (venta-list.html:118-124); las líneas se ven en el detalle (RF-08). El E2E valida que el POST lleve las dos líneas, pero no abre el detalle de esa venta recién creada.
2. RF-04 "sin líneas": el estado es inalcanzable porque el botón Quitar se deshabilita con una sola línea (venta-form.html:182, venta-form.ts:90-95). El comportamiento cumple (no se puede guardar sin líneas), pero el guard lineas.length === 0 y el minLength(1) quedan como defensa.
3. RF-08: la descripción se oculta si está vacía (venta-detail-modal.html:36-39). Si el criterio exige ver siempre el rótulo "Descripción", habría que mostrarlo con un guion.
4. RF-09/RF-10: la parte de "resumen" está implementada, pero no asegurada por tests E2E. Es la única brecha real de verificación, no de código.
Dos preguntas de alcance
- ¿"La venta aparece en el listado con sus dos líneas" se interpreta como que el listado debe mostrar las líneas, o alcanza con que la venta aparezca y las líneas se vean en el detalle?
- ¿La descripción vacía debe mostrarse igual como campo del detalle, o está bien que se omita?
Como referencia, la última corrida dio 24/24 unitarios, 10/10 E2E y build OK. No modifiqué ningún archivo.