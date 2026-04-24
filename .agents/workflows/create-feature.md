# Workflow: Crear Nueva Funcionalidad (`/crear-feature`)

Proceso estándar para implementar cualquier cambio de extremo a extremo en el stack Transer OS (Astro + Bridge + Admin UI).

---

## Pasos del Workflow

### Paso 1 — Análisis de Requisitos
- Definir qué capa(s) se ven afectadas: Frontend público (Astro), Backend (Bridge), Admin UI (React), o Pipeline de publicación.
- Identificar si la feature requiere:
  - Nuevos campos en SQLite → definir esquema bilingüe.
  - Nuevos endpoints en Bridge → planificar middleware de autenticación desde el inicio.
  - Nuevos componentes en Astro o Admin UI → planificar tokens de diseño requeridos.
- Documentar brevemente el flujo de datos: `Admin UI → Bridge API → SQLite → Pipeline → src/data/*.json → Astro`.

### Paso 2 — Diseño UI/UX (si aplica)
- Cargar reglas de `frontend-expert.md` y verificar:
  - [ ] Variables CSS necesarias ya existen en `:root` de `TranserOS.astro`, o se deben agregar de forma no disruptiva.
  - [ ] Nuevos componentes Astro o React siguen las convenciones de estructura definidas.
  - [ ] Las cadenas de texto nuevas se agregan a `src/i18n/ui.ts` en ambos idiomas antes de codificar.

### Paso 3 — Implementación Backend
- Cargar reglas de `backend-expert.md` y verificar antes de escribir código:
  - [ ] Toda nueva ruta en Bridge incluye el middleware JWT como primer handler.
  - [ ] Queries SQLite usan placeholders parametrizados.
  - [ ] Si el endpoint modifica más de una tabla, se usa una transacción.
  - [ ] Los errores se manejan con la clase `AppError` centralizada.

### Paso 4 — Integración Frontend
- Conectar la UI con los nuevos endpoints del Bridge.
- Verificar que el Admin UI pasa el JWT en el header `Authorization: Bearer <token>` en cada llamada.
- Verificar que la respuesta del API se valida en cliente antes de renderizar (no asumir forma del objeto).

### Paso 5 — Escritura de Tests (mínimo smoke tests)
- Al menos un test de integración para cada nuevo endpoint del Bridge.
- Verificar casos borde: token expirado, body malformado, ID de Drive inexistente.

---

## ⛔ CONDICIÓN DE CIERRE — Validación Cruzada Obligatoria

> **El agente NO puede marcar la tarea como completada sin ejecutar este checklist completo.**

### 🎨 Revisión: Experto Frontend (`frontend-expert.md`)
- [ ] Los estilos nuevos derivan de variables de `TranserOS.astro`; ningún valor hardcoded de color/tamaño.
- [ ] Los textos usan `i18n/ui.ts` o JSON de idioma. No hay strings en español o inglés hardcodeados en templates.
- [ ] El build de Astro (`npm run build`) finaliza sin errores ni warnings de `<Image />`.

### ⚙️ Revisión: Experto Backend (`backend-expert.md`)
- [ ] Todas las rutas nuevas tienen middleware JWT activo.
- [ ] No hay queries SQL con concatenación de strings de usuario.
- [ ] Si se tocó el pipeline de publicación, se verificó que es atómico (no deja archivos a medias en `src/data/`).

### 🔒 Revisión: Experto en Ciberseguridad (`security-expert.md`)
- [ ] No hay credenciales, tokens ni secrets hardcodeados en ningún archivo del commit.
- [ ] Los nuevos inputs del API tienen validación de esquema Zod.
- [ ] No se introducen vulnerabilidades OWASP Top 10 (revisar especialmente A03:Injection y A07:Auth Failures).
- [ ] CORS no fue ampliado sin justificación documentada.
- [ ] `npm audit` ejecutado; sin vulnerabilidades `high`/`critical` nuevas.

> **Si algún ítem del checklist falla, la feature vuelve al paso correspondiente. No se hace merge hasta que los tres expertos validan.**
