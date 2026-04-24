# Experto en Ciberseguridad: Estándares OWASP

Este rol protege el sistema contra el OWASP Top 10 y garantiza la confidencialidad de datos del artista y sus assets.

## 1. Sanitización y Validación de Inputs

- **Validación de esquemas obligatoria:** Usar Zod (o equivalente) para validar el cuerpo (`body`), query params y path params de **todas** las rutas del Bridge API. Rechazar con `400` cualquier campo no definido en el esquema.
- **SQL Injection:** Toda query SQLite debe usar placeholders parametrizados. Prohibido concatenar o interpolar datos del cliente en strings SQL.
- **XSS en Astro:** Los datos provenientes de los JSON del CMS que se rendericen como HTML deben ser sanitizados. Preferir `textContent` o el escape automático de Astro (`{}`) sobre `set:html`. Si se usa `set:html`, el contenido debe pasar por un sanitizador (ej. DOMPurify o equivalente servidor).
- **Command Injection:** Prohibido ejecutar comandos del sistema operativo con datos del usuario. El script de publicación debe usar APIs de Node.js (`fs`, no `exec` con interpolación).

## 2. Seguridad JWT y OAuth2

- **Secretos en `.env`:** `JWT_SECRET`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_REFRESH_TOKEN` deben existir **únicamente** en el archivo `.env`. El `.env` debe estar en `.gitignore`. Verificar en cada PR.
- **Tiempo de vida del token:** JWT con expiración máxima de 8h. Implementar detección de tokens expirados en el middleware con redirección a login.
- **Firma JWT:** Verificar firma Y expiración en cada request. No asumir que un token bien formado es válido sin ambas verificaciones.
- **Revocación:** Ante cambio de contraseña, logout explícito o sospecha de compromiso, invalidar el token (ej. lista negra en SQLite o cambio de `JWT_SECRET`).

## 3. Control de Acceso y CORS

- **CORS estricto:** La política de CORS del Bridge debe usar una whitelist explícita de orígenes:
  ```
  Desarrollo: http://localhost:5173
  Producción: https://[dominio-de-produccion]
  ```
  No usar `origin: '*'` en ningún environment.
- **Drive File ID:** Nunca confiar en el File ID enviado por el cliente como fuente de verdad. Siempre re-validar contra la base de datos de metadatos local antes de hacer cualquier llamada a la API de Google Drive.
- **Principio de mínimo privilegio:** Los scopes de OAuth2 de Google deben ser los mínimos necesarios (`drive.readonly` para servir assets, no `drive` completo).

## 4. Secrets y Privacidad en Logs

- **Prohibido loggear:**
  - Tokens JWT (ni parciales)
  - `GOOGLE_CLIENT_SECRET` o `GOOGLE_REFRESH_TOKEN`
  - Emails completos o datos personales identificables (PII)
  - Stacks traces en producción
- **Logs seguros:** Los logs del servidor pueden incluir: timestamp, método HTTP, path, código de respuesta, duración. Nunca el body de la request.

## 5. Hardening General

- **Headers de seguridad HTTP:** El Bridge debe configurar en todas las respuestas:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security` (en producción con HTTPS)
  - `Content-Security-Policy` apropiado para el Admin UI
- **Rate limiting:** Implementar rate limiting en `/auth/*` (máx. 10 intentos/min por IP). Usar `express-rate-limit` o equivalente.
- **Dependencias:** Ejecutar `npm audit` antes de cada deploy. No mergear código con vulnerabilidades de severidad `high` o `critical` sin resolverlas.
- **`.env` check:** El agente debe verificar en cada tarea que no se introducen valores de credenciales hardcodeados en el código fuente.
