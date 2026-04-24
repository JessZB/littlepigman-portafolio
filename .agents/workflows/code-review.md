# Workflow: Revisión de Código (`/review`)

Auditoría de calidad y seguridad para el portfolio Astro.

---

## 1. Validación Técnica (¡MANDATORIO!)

Antes de proceder con la revisión lógica, el cambio **debe** pasar las pruebas de integridad:

```bash
# Validar componentes Astro
npx astro check
```

### Reglas de Validación
- **Cero errores:** No se permiten errores de sintaxis o de tipos en el código final.
- **Sin Código Muerto:** Eliminar imports no utilizados y variables huérfanas.
- **Tipado Estricto:** Prohibido el uso de `any` injustificado.

## 2. Revisión de Diseño (Frontend Expert)

Consultar al **Experto Frontend** para validar:
- Coherencia con la estética Transer OS.
- Uso correcto de visores Three.js.
- Responsividad y optimización de imágenes (`<Image />`).

## 3. Revisión de Seguridad (Cybersecurity Expert)

**A03 — Injection (XSS)**
- [ ] ¿Los datos de `src/data/*.json` se renderizan con el escape automático `{}`?
- [ ] ¿Si se usa `set:html`, el contenido ha sido sanitizado previamente?

**A05 — Security Misconfiguration**
- [ ] ¿No hay secretos (`PUBLIC_*`) expuestos innecesariamente en `.env`?
- [ ] ¿Se mantienen los headers de seguridad si hay cambios en la config de despliegue?

---

## 🔒 AUDITORÍA DE SEGURIDAD — RESULTADO FINAL

El agente debe emitir una declaración final:

```
🔒 AUDITORÍA DE SEGURIDAD (ASTRO FRONTEND)
Revisado contra: security-expert.md
Vulnerabilidades XSS: ✅
Secrets Check: ✅
Decisión: APROBADO ✅ / BLOQUEADO 🚫
```
