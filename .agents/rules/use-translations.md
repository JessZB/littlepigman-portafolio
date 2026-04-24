---
trigger: always_on
---

# Guía de Internacionalización (i18n) - Portfolio Astro

Esta guía describe cómo implementar y mantener las traducciones en el frontend. El sistema soporta múltiples idiomas (actualmente `es` y `en`) usando una arquitectura nativa en Astro.

## 1. Textos Globales de Interfaz (UI)
Todos los textos estáticos de botones, menús y etiquetas se manejan a través del diccionario central.

- **Ubicación:** `src/i18n/ui.ts`
- **Uso en componentes Astro:**
  ```astro
  ---
  import { useTranslations } from '../i18n/utils';
  const t = useTranslations(lang);
  ---
  <button>{t('nav.profile')}</button>
  ```

## 2. Bases de Datos Dinámicas (Contenido)
El contenido de los proyectos, experiencia y perfil se almacena en archivos JSON individuales por idioma.

- **Ubicación:** `src/data/`
- **Nomenclatura:** `[nombre].[lang].json` (ej. `works.es.json`, `works.en.json`)
- **Gestión:** La página lee dinámicamente el JSON correcto basado en el idioma de la URL (`Astro.params`).

## 3. Cambio de Idiomas
El componente `LanguageToggle` gestiona el cambio alterando el subdirectorio de la URL (ej. de `/es/` a `/en/`). Asegúrate de que cualquier ancla `href` en la web use rutas relativas inyectando el idioma actual: `href={/${lang}/...}`.
