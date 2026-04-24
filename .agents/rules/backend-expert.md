# Experto Backend: Bridge API y Persistencia SQLite

Este rol supervisa la lógica de negocio en Express, la integridad de la base de datos y la seguridad del proxy de Google Drive.

## 1. Seguridad de Rutas y JWT

- **Middleware Obligatorio:** Todas las rutas bajo `/api/admin/*` y `/api/file/*` deben pasar por el middleware de verificación JWT (`/bridge/src/auth/session.ts`) **antes** de ejecutar cualquier lógica de negocio.
- **Respuesta ante JWT inválido:** Devolver siempre `401 Unauthorized` con cuerpo genérico. Nunca revelar si el token expiró, si fue manipulado o si el usuario no existe.
- **Sesiones Stateless:** No almacenar estado de sesión en el servidor. El estado vive únicamente en el JWT firmado.

## 2. Gestión de Datos (SQLite)

- **IDs internos:** No exponer IDs autoincrementales de SQLite (`ROWID`) directamente en la respuesta de la API. Usar la columna `id` definida explícitamente o un UUID cuando aplique.
- **Esquema bilingüe:** Respetar la nomenclatura de campos (`title_es`, `title_en`, `description_es`, `description_en`). Todo nuevo campo con contenido visible al usuario debe tener variante por idioma.
- **Queries parametrizadas:** Obligatorio usar `?` placeholders en todas las queries SQLite. Prohibido concatenar strings de usuario en queries SQL.
- **Transacciones:** Operaciones que modifiquen múltiples tablas deben envolverse en una transacción (`BEGIN / COMMIT / ROLLBACK`).

## 3. Proxy de Google Drive

- **Validación de Permisos (doble verificación):**
  1. Verificar que el `googleId` del JWT corresponde al propietario del recurso en la base de datos local de metadatos.
  2. Consultar `capabilities` y `permissions` en la Google Drive API antes de iniciar el stream.
  3. Si alguna verificación falla → `403 Forbidden`. No iniciar el stream parcialmente.
- **Streaming:** Usar `pipe` o streams de Node.js para servir el archivo. **Nunca** acumular el archivo completo en memoria del servidor.
- **Headers seguros:** Pasar únicamente `Content-Type`, `Content-Length` y `Cache-Control` al cliente. Eliminar headers de Drive que expongan metadatos internos.

## 4. Pipeline de Publicación (Atómico)

- La exportación en `/api/admin/publish` debe ser **todo o nada**:
  1. Generar los JSON en un directorio temporal (ej. `bridge/tmp/`).
  2. Validar que ambos archivos (`works.es.json`, `works.en.json`) fueron generados y son JSON válido.
  3. Solo si ambos son válidos, copiar atómicamente a `src/data/`. En caso de fallo en cualquier paso, no sobrescribir los archivos existentes.
  4. Crear un backup temporal fechado antes de sobrescribir (ej. `works.es.backup.json`).
- Loggear el resultado de cada publicación con timestamp en el servidor (sin incluir datos sensibles).

## 5. Manejo de Errores

- **Tipificación:** Usar una clase de error central (`AppError`) con código HTTP y mensaje descriptivo interno, pero devolver al cliente solo el código HTTP y un mensaje genérico seguro.
- **Stack traces:** Prohibido enviar stack traces al cliente en cualquier environment. Solo loggear internamente en development.
- **Códigos HTTP semánticos:** `400` para inputs inválidos, `401` para no autenticado, `403` para no autorizado, `404` para recurso inexistente, `500` para errores internos inesperados.
