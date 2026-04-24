---
trigger: always_on
---

# Guía de Internacionalización (i18n) - Transer OS

Esta guía describe cómo implementar y mantener las traducciones en el portafolio Transer OS. El sistema soporta múltiples idiomas (actualmente `es` y `en`) usando una arquitectura nativa en Astro.

## 1. Textos Globales de Interfaz (UI)
Todos los textos estáticos de botones, menús y utilidades del sistema operativo se manejan a través del diccionario central.

- **Ubicación:** `src/i18n/ui.ts`
- **Uso en componentes Astro:**
  ```astro
  ---
  import { getLangFromUrl, useTranslations } from '../i18n/utils';
  
  const lang = getLangFromUrl(Astro.url);
  const t = useTranslations(lang);
  ---
  <!-- Uso en HTML -->
  <button>{t('nav.profile')}</button>
  ```

- **Agregar nuevo texto:**
  Agrega la clave en ambos idiomas dentro de `ui.ts`:
  ```typescript
  export const ui = {
    es: { 'nueva.clave': 'Texto en Español' },
    en: { 'nueva.clave': 'Text in English' }
  } as const;
  ```

## 2. Bases de Datos Dinámicas (Contenido)
El contenido de los proyectos, experiencia y perfil se almacena en archivos JSON individuales por idioma.

- **Ubicación:** `src/data/`
- **Nomenclatura:** `[nombre].[lang].json` (ej. `works.es.json`, `works.en.json`)
- **Uso en Rutas Dinámicas (`src/pages/[lang]/index.astro`):**
  La página lee dinámicamente el JSON correcto basado en el idioma de la URL:
  ```javascript
  const { lang } = Astro.params;
  const worksDataModule = await import(`../../data/works.${lang}.json`);
  const worksData = worksDataModule.default;
  ```
- **Regla:** Mantén siempre la misma estructura y claves (ID) en todos los archivos `.json` de idiomas. Si modificas un array en español, haz la réplica estructural en inglés.

## 3. JavaScript Vainilla (Lógica del Cliente)
Algunos textos son generados al vuelo por JavaScript en el cliente (como etiquetas dentro de modales o el reloj). Estos deben inyectarse desde Astro.

- **Inyección de dependencias:**
  Pasa las traducciones al objeto `window.portfolioUI` dentro del archivo `.astro`:
  ```astro
  <script is:inline define:vars={{ 
    lang,
    textRol: t('proj.role')
  }}>
    window.portfolioUI = { role: textRol, lang };
  </script>
  ```
- **Uso en JS:**
  ```javascript
  const span = document.createElement('span');
  span.innerText = window.portfolioUI.role; // Renderizará 'Rol' o 'Role'
  ```

## 4. Cambio de Idiomas
El componente `LanguageToggle` en `[lang]/index.astro` gestiona el cambio alterando el subdirectorio de la URL (ej. de `/es/` a `/en/`). Asegúrate de que cualquier ancla `href` en la web use rutas relativas inyectando el idioma actual `href={\`/${lang}/seccion\`}`.
