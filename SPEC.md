# Spec: Registro de ventas

## Contexto y objetivo
La aplicación es una aplicación web en Angular para registrar ventas de forma
simple: qué se vendió, cuántos, a qué precio, a quién, cómo pagó y una
descripción opcional. Es de uso personal: la usa una sola persona, sin inicio
de sesión. El objetivo es cargar una venta rápido, encontrarla después con
filtros y ver cuánto se vendió en un período.

## Alcance
La primera versión cubre cuatro cosas: registrar, listar con filtros, editar o
eliminar, y ver totales.

**Incluye**
- Alta de ventas con una o más líneas de producto.
- Listado de ventas con filtros por fecha, cliente, medio de pago y moneda.
- Edición y eliminación de ventas ya cargadas.
- Resumen de totales del período filtrado.

**No incluye**
- Catálogo de productos ni control de stock: los productos se escriben como texto libre.
- Registro de clientes: el cliente es solo un nombre en texto libre.
- Inicio de sesión, roles o varios usuarios.
- Conversión entre ARS y USD, impuestos, descuentos y facturación.

## Requisitos funcionales
Cada venta tiene datos generales y una o más líneas de producto; el total de la
venta es la suma de sus líneas.

| ID | Requisito |
|---|---|
| RF-01 | Registrar una venta con fecha (por defecto, hoy), cliente, medio de pago, moneda (ARS o USD) y descripción opcional. |
| RF-02 | Agregar y quitar líneas de producto en una venta. Cada línea tiene nombre (texto libre), cantidad y precio unitario. |
| RF-03 | Calcular en pantalla el subtotal de cada línea (cantidad × precio unitario) y el total de la venta. |
| RF-04 | Validar antes de guardar: al menos una línea, nombre de producto y cliente no vacíos, cantidad mayor a 0, precio mayor o igual a 0. |
| RF-05 | Elegir el medio de pago de una lista fija. |
| RF-06 | Listar las ventas ordenadas por fecha, de la más reciente a la más antigua. |
| RF-07 | Filtrar el listado por rango de fechas, cliente (coincidencia parcial), medio de pago y moneda. |
| RF-08 | Ver el detalle de una venta con todas sus líneas. |
| RF-09 | Editar cualquier dato de una venta ya guardada. |
| RF-10 | Eliminar una venta, previa confirmación. |
| RF-11 | Mostrar un resumen del período filtrado: cantidad de ventas y total vendido por moneda y por medio de pago. Por defecto, el mes en curso. |

Los totales se muestran por separado para ARS y USD; la app no convierte entre monedas.

## Modelo de datos
Una colección ventas en Base de datos, con un documento por venta y las líneas
de producto dentro del mismo documento.

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| fecha | fecha | Sí | Por defecto, el día de la carga. |
| cliente | texto | Sí | Texto libre. |
| medio_pago | texto | Sí | Uno de los valores definidos en la app. |
| moneda | ARS/USD | Sí | Una moneda por venta. |
| descripcion | texto | No | Nota libre. |
| items | lista | Sí | Al menos una línea: producto (texto), cantidad (número), precioUnitario (número). |
| total | número | Sí | Suma de cantidad × precio de las líneas; se guarda para facilitar el resumen. |
| creado_en, actualizado_en | fecha y hora | Sí | Los completa la app. |

## Restricciones técnicas
- **Framework:** Angular v22, con TypeScript en modo estricto y formularios reactivos.
- **Interfaz:** Bootstrap para estilos y componentes. Diseño responsive, usable en celular y en escritorio.
- **Datos:** Supabase como base de datos, conectado desde Angular con `@supabase/supabase-js`, usando la URL del proyecto y la clave publishable (`sb_publishable_...`). La colección `ventas` es una tabla de Supabase que ya existe, con una fila por venta y los mismos campos del modelo de datos con nombres en snake_case (por ejemplo `medio_pago`, `creado_en`), más una columna `id` generada por la base. Las líneas van en la columna `items` (JSON). La app no crea ni modifica el esquema.
- **Claves:** la URL y la clave se leen de `src/environments/environment.ts` (campos `supabaseUrl` y `supabaseKey`), nunca en el código de los componentes. Se incluye un `environment.example.ts` con valores de ejemplo. No se usa nunca la clave secret ni `service_role` en la app.
- **Seguridad:** sin inicio de sesión y con reglas RLS abiertas, por ser de uso personal. Cualquiera que conozca la URL de la aplicación podría leer y modificar los datos, así que no conviene cargar información sensible.
- **Idioma y formato:** interfaz en español, fechas en formato dd/mm/aaaa y montos con dos decimales y configuración regional es-AR, con coma decimal (por ejemplo, 4.501,50).
- **Navegadores:** versiones recientes de Chrome, Firefox, Edge y Safari.

## Despliegue

- **Hosting:** Vercel, con la app Angular en `app/` como raíz del proyecto.
- **Build:** `npm run build:vercel`; la salida publicada es `dist/app/browser`.
- **Node:** 24.x.
- **Variables de entorno:** `SUPABASE_URL` y `SUPABASE_KEY` se configuran en Vercel. `scripts/generar-environment.mjs` genera `src/environments/environment.ts` durante el build; ese archivo está en `.gitignore` y nunca se versiona.
- **Rutas:** un rewrite de SPA hacia `/index.html` permite recargar rutas profundas como `/ventas/nueva` o `/ventas/:id/editar`.
- **Métodos de deploy:** manual con Vercel CLI y automático desde un repositorio de GitHub.
- **Seguridad:** al build solo se pasa la clave publishable (`sb_publishable_...`); nunca `service_role` ni la clave secret. La publishable queda en el bundle porque es pública por diseño.

## Criterios de aceptación
| Requisito | Se considera cumplido cuando |
|---|---|
| RF-01, RF-02 | Al completar el formulario con dos líneas de producto y guardar, la venta aparece en el listado con sus dos líneas y sus datos generales. |
| RF-03 | Al cambiar cantidad o precio de una línea, el subtotal y el total se actualizan sin guardar. Por ejemplo, 3 × 1500,50 da un subtotal de 4501,50. |
| RF-04 | No se puede guardar sin líneas, con cliente vacío, con cantidad 0 o con precio negativo; la pantalla indica qué campo corregir. |
| RF-05 | El medio de pago solo admite valores de la lista; no se puede escribir uno distinto. |
| RF-06 | Con ventas de distintas fechas, la primera fila del listado es la de fecha más reciente. |
| RF-07 | Al filtrar por un medio de pago, el listado muestra solo ventas con ese medio. Combinar filtros muestra solo las ventas que cumplen todos. |
| RF-08 | Al abrir una venta se ven todas sus líneas, la descripción y el total. |
| RF-09 | Al editar una venta y guardar, el listado y el resumen reflejan los cambios al recargar la página. |
| RF-10 | Al eliminar y confirmar, la venta desaparece del listado y del resumen. Si se cancela, no cambia nada. |
| RF-11 | Con ventas en ARS y en USD dentro del período, el resumen muestra un total para cada moneda y ninguno combinado. |
| General | La aplicación funciona en pantalla de celular (360 px de ancho) sin desplazamiento horizontal y los datos persisten al cerrar y volver a abrir el navegador. |
| Deploy | La app publicada en Vercel abre el listado, una ruta profunda como /ventas/nueva responde al recargar, y el build toma las credenciales de variables de entorno sin secretos en el repositorio. |

## Puntos abiertos y riesgos
- **Medios de pago:** efectivo, transferencia, tarjeta de débito, tarjeta de crédito.
- **Datos expuestos:** con reglas abiertas, los datos son accesibles para cualquiera que tenga la URL.
- **Hosting:** Vercel (ver “Despliegue”).
- **Exportación:** exportar a CSV o Excel queda fuera de esta versión.
- **Cantidad de ventas:** el listado con paginación.
