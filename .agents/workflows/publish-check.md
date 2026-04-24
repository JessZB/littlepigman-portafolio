# Workflow: Verificación de Publicación (`/deploy-check`)

Checklist de validación del pipeline completo antes de considerar una publicación como exitosa.
Este workflow cubre el ciclo: `Admin UI → Bridge → src/data/*.json → Astro SSG`.

---

## Pasos del Workflow

### Paso 1 — Estado del entorno
- Verificar que los tres servicios están corriendo:
  - [ ] Bridge API → `localhost:3001` responde a `GET /health` (o ruta equivalente).
  - [ ] Admin UI → `localhost:5173` levanta sin errores en consola.
  - [ ] Astro Dev → `localhost:4321` levanta correctamente (o usar `npm run build`).
- Verificar que el `.env` del Bridge contiene `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_REFRESH_TOKEN`.

### Paso 2 — Validación de autenticación
- Cargar reglas de `security-expert.md` → Sección "JWT y OAuth2".
- [ ] El token JWT activo en el Admin UI no está expirado (verificar en Network tab o decodificando sin verificar firma para inspección).
- [ ] El Bridge puede refrescar el token de Google Drive sin error (hacer una llamada de prueba a `/api/file/:id` con un asset conocido).
- [ ] Si el token de Google está próximo a expirar, forzar el refresh antes de continuar.

### Paso 3 — Ejecución del Pipeline de Publicación
- Cargar reglas de `backend-expert.md` → Sección "Pipeline de Publicación (Atómico)".
- Desde el Admin UI, ejecutar la acción **Publicar**.
- Verificar en los logs del Bridge:
  - [ ] Generación de JSON en directorio temporal completada sin errores.
  - [ ] `works.es.json` es JSON válido (no malformado).
  - [ ] `works.en.json` es JSON válido (no malformado).
  - [ ] Ambos archivos copiados atómicamente a `src/data/`.
  - [ ] Los archivos backup fueron creados antes de la sobrescritura.

### Paso 4 — Validación de Estructura JSON
- Abrir `src/data/works.es.json` y `src/data/works.en.json`.
- [ ] Ambos archivos tienen el mismo array de IDs de proyectos (mismo orden, mismos identificadores).
- [ ] Todos los campos bilingües están presentes en ambos archivos (`title_es`/`title_en` no son undefined ni vacíos).
- [ ] Los assets con `type: "3d-model"` tienen `fileId` de Google Drive válido (no placeholder).

### Paso 5 — Build de Astro
- Ejecutar `npm run build` en el directorio raíz.
- [ ] El build finaliza con code 0 (sin errores).
- [ ] No hay warnings de `<Image />` con `src` no encontrado.
- [ ] El directorio `dist/` se genera con las rutas `/es/` y `/en/` correctas.
- [ ] Verificar visualmente las páginas generadas con `npm run preview` (spot check al menos: perfil, 1 proyecto con 3D, 1 proyecto con galería).

### Paso 6 — Verificación de Assets en Producción
- Cargar reglas de `security-expert.md` → Sección "Drive File ID".
- [ ] Hacer una solicitud directa al Bridge proxy para al menos 2 assets de Drive: `GET /api/file/:id` con JWT válido → responde `200` con el archivo.
- [ ] La misma solicitud sin JWT → responde `401`.
- [ ] La misma solicitud con un JWT modificado/inválido → responde `401`.

---

## ⛔ CONDICIÓN DE CIERRE — Validación Cruzada de los Tres Expertos

> **La publicación NO se confirma como exitosa sin el visto bueno de los tres roles.**

### 🎨 Experto Frontend (`frontend-expert.md`)
- [ ] Astro build exitoso (Paso 5 completo).
- [ ] Spot check visual confirma que el diseño Transer OS está íntegro.
- [ ] Las rutas de idioma (`/es/` y `/en/`) están correctamente generadas.

**Declaración Frontend:** `BUILD ASTRO ✅ / ❌ (detalle)`

### ⚙️ Experto Backend (`backend-expert.md`)
- [ ] Pipeline de publicación fue atómico (Paso 3 completo sin abortar a mitad).
- [ ] Los backups de los JSON anteriores existen antes de ser reemplazados.
- [ ] El Bridge API está respondiendo correctamente a autenticación y proxy.

**Declaración Backend:** `PIPELINE ATÓMICO ✅ / ❌ (detalle)`

### 🔒 Experto en Ciberseguridad (`security-expert.md`)
- [ ] El proxy de Drive rechaza requests no autenticadas (Paso 6).
- [ ] No se verificó ningún `.env` con valores hardcodeados en el código fuente durante el proceso.
- [ ] El JWT activo tiene tiempo de vida dentro de los límites definidos en `security-expert.md`.

**Declaración Seguridad:** `PROXY VALIDADO ✅ / ❌ (detalle)`

---

> Si cualquier declaración es ❌, el proceso de deploy se **detiene**. Resolver el problema, reiniciar desde el paso correspondiente, y obtener los tres visto buenos antes de confirmar la publicación.
