# Workflow: Validación de Publicación (`/publish-check`)

Verifica que el sitio esté listo para ser generado estáticamente (SSG) sin errores.

## Pasos del Workflow

### 1. Integridad de Datos
- [ ] Verificar que todos los archivos en `src/data/` existen para ambos idiomas (`es` y `en`).
- [ ] Validar que `works.es.json` y `works.en.json` tienen la misma cantidad de proyectos y los mismos IDs.
- [ ] Comprobar que no hay campos requeridos vacíos (según `DATA_SCHEMA.md`).

### 2. Validación de Assets
- [ ] Verificar que las rutas locales de imágenes en `/public/` o `/src/assets/` son correctas.
- [ ] Confirmar que los componentes tienen fallbacks implementados por si fallan las URLs del proxy de Yezzfolio.

### 3. Build de Producción
Ejecutar el comando de build para asegurar que no hay errores de SSR o de resolución de rutas:

```bash
npm run build
```

---

## Resultado de Validación

```
🚀 PUBLICACIÓN — STATUS
Estructura JSON: ✅
Identidad de IDs (ES/EN): ✅
Build Success: ✅
Decisión: LISTO PARA DEPLOY 🟢 / CORREGIR 🔴
```
