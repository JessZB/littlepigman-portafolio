# Workflow: Revisión de Código (`/code-review`)

Auditoría exhaustiva de calidad y seguridad para cualquier PR o commit en el stack Transer OS.

---

## Pasos del Workflow

### Paso 1 — Análisis del Diff
- Identificar archivos modificados y clasificarlos por capa:
  - `src/` → Frontend Astro (aplica reglas de `frontend-expert.md`)
  - `bridge/src/` → Bridge Backend (aplica reglas de `backend-expert.md`)
  - `bridge/admin-ui/src/` → Admin React (aplica reglas de `frontend-expert.md` + `security-expert.md`)
  - `src/data/` → JSON generados (verificar estructura bilingüe)
- Estimar el riesgo del cambio: bajo / medio / alto (cambios en auth, proxy Drive o pipeline = alto).

### Paso 2 — Checklist Frontend (`frontend-expert.md`)
- [ ] ¿Los estilos nuevos usan variables CSS de `:root` en `TranserOS.astro`?
- [ ] ¿Los textos visibles están en `ui.ts` (Astro) o en las claves `i18next` del Admin? ¿Existen en ambos idiomas?
- [ ] ¿Los componentes Astro nuevos son estáticos por defecto? ¿Se justifica cualquier `client:*`?
- [ ] ¿Las imágenes usan `<Image />` de Astro con `loading="lazy"` donde corresponde?
- [ ] ¿El drag & drop del Admin usa `@dnd-kit` y no una librería alternativa?

### Paso 3 — Checklist Backend (`backend-expert.md`)
- [ ] ¿Toda ruta nueva bajo `/api/admin/*` o `/api/file/*` tiene el middleware JWT como primer handler?
- [ ] ¿Todas las queries SQLite usan `?` parametrizado? ¿Ninguna concatena strings del usuario?
- [ ] ¿El manejo de errores usa la clase centralizada `AppError` y no expone stack traces?
- [ ] ¿Las operaciones multi-tabla están en una transacción `BEGIN / COMMIT / ROLLBACK`?
- [ ] ¿El streaming del proxy Drive usa `pipe`/streams sin acumular el archivo en memoria?

### Paso 4 — Auditoría de Seguridad (`security-expert.md`)

> Esta es la fase de **mayor peso**. Si hay conflicto con los pasos anteriores, este paso tiene prioridad.

**A03 — Injection**
- [ ] ¿Ningún query SQL concatena datos del usuario? → usar Zod + placeholders SQLite.
- [ ] ¿No hay `exec()`, `eval()` ni `child_process` con inputs del cliente?

**A07 — Authentication Failures**
- [ ] ¿El JWT se verifica (firma + expiración) en cada request protegida?
- [ ] ¿`JWT_SECRET` y `GOOGLE_CLIENT_SECRET` solo existen en `.env` y no aparecen en el diff?

**A05 — Security Misconfiguration**
- [ ] ¿La política CORS no fue ampliada más allá de la whitelist definida en `security-expert.md`?
- [ ] ¿Los headers de seguridad siguen presentes (`X-Content-Type-Options`, `X-Frame-Options`)?

**A02 — Cryptographic Failures**
- [ ] ¿No se loggea ningún token, secret ni PII en el diff?

**A01 — Broken Access Control**
- [ ] ¿El File ID de Drive siempre se re-valida contra la DB local antes de llamar a la API de Google?

---

## ⛔ CONDICIÓN DE CIERRE — Veto del Experto en Ciberseguridad

> **El workflow de code-review NO puede finalizar sin la confirmación explícita del Experto en Ciberseguridad.**

El agente debe emitir una declaración final en este formato:

```
🔒 AUDITORÍA DE SEGURIDAD — RESULTADO FINAL
Revisado contra: security-expert.md
OWASP Top 10 cubiertos: A01 ✅ | A02 ✅ | A03 ✅ | A05 ✅ | A07 ✅
Vulnerabilidades encontradas: [ninguna / lista detallada]
Decisión: APROBADO ✅ / BLOQUEADO 🚫 (razón)
```

> Si el resultado es **BLOQUEADO**, el PR no puede mergearse. Los problemas deben resolverse y el workflow debe reiniciarse desde el Paso 4.
