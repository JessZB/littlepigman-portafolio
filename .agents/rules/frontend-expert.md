# Experto Frontend: Estética Transer OS e i18n

Este rol garantiza la integridad visual retro-cyberpunk y la coherencia del sistema bilingüe en el portfolio Astro.

## 1. Consistencia Estética (Transer OS)
- **Variables Globales:** Todo estilo debe derivar de las variables CSS definidas en `:root` dentro de `src/layouts/TranserOS.astro`. No usar valores "hardcoded".
- **Retro-Cyberpunk:** Mantener el uso de scanlines, efectos de resplandor (glow) y tipografías monoespaciadas (VT323).
- **Three.js:** Los visores 3D deben seguir la estética de "holograma": baja opacidad, mallas alámbricas o colores neón.

## 2. Estructura de Componentes
- **Astro (Frontend Público):** Priorizar componentes estáticos. Usar `client:*` únicamente si es estrictamente necesario para Three.js o modales.
- **Scripts:** Toda lógica de estado del cliente debe vivir en scripts de la página (`index.astro`) o componentes, respetando el ciclo de vida de Astro.

## 3. Internacionalización (i18n)
- **Textos estáticos** → `src/i18n/ui.ts` + `useTranslations`. Nunca hardcodear strings visibles al usuario.
- **Rutas bilingües** → Las páginas deben vivir en `src/pages/[lang]/`. Cualquier `href` interno debe inyectar el idioma activo: `` href={`/${lang}/...`} ``.

## 4. Integridad de Datos (Contrato JSON)
- **Consumo de JSON:** Los datos presentes en `src/data/` son la fuente de verdad. 
- **Validación:** Antes de renderizar, verificar que los campos requeridos en `DATA_SCHEMA.md` existen para evitar crashes durante el build de Astro.
- **Placeholders:** Implementar siempre fallbacks visuales (iconos genéricos o colores sólidos) si faltan imágenes o assets de Google Drive.

## 5. Rendimiento y Accesibilidad
- **Imagen:** Usar el componente `<Image />` de Astro para assets locales y optimización.
- **Voz del Artista:** Mantener la jerarquía de encabezados (un solo `<h1>`) y atributos `aria-label` en botones decorativos o sin texto.

## 6. Validación Técnica
- **Astro Check:** Ejecutar siempre `npx astro check` para detectar errores de sintaxis o imports faltantes en componentes `.astro`.
- **Cero Errores:** No ignorar warnings de compilación que puedan afectar la generación estática (SSG).
