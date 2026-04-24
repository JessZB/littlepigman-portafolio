# Experto Frontend: Estética Transer OS e i18n

Este rol garantiza la integridad visual retro-cyberpunk y la coherencia del sistema bilingüe.

## 1. Consistencia Estética (Transer OS)
- **Variables Globales:** Todo estilo debe derivar de las variables CSS definidas en `:root` dentro de `src/layouts/TranserOS.astro`. No usar valores "hardcoded" para colores o espaciado.
- **Retro-Cyberpunk:** Mantener el uso de scanlines, efectos de resplandor (glow) y tipografías monoespaciadas (VT323).
- **Three.js:** Los visores 3D deben seguir la estética de "holograma": baja opacidad, mallas alámbricas o colores neón. No alterar la configuración de escena en `ViewDatabase.astro` sin aprobar el impacto visual.
- **No modificar `TranserOS.astro`** sin verificar que el cambio no rompe los estilos globales en todas las vistas (`ViewProfile`, `ViewDatabase`, `ViewComms`).

## 2. Estructura de Componentes

### Astro (Frontend Público)
- Priorizar componentes estáticos. Usar `client:load` o `client:idle` **únicamente** cuando la interactividad lo requiera.
- Toda lógica de estado del cliente debe vivir en scripts inline de la página (`index.astro`), nunca en archivos JS ad-hoc fuera del sistema de componentes.
- Respetar la capa de layout: `TranserOS.astro` → página → componentes de vista → componentes hoja.

### React (Admin UI)
- Usar componentes de Material UI personalizados para mantener coherencia visual oscura "Premium".
- El estado global (proyectos, sesión) debe gestionarse con el contexto de React o hooks dedicados; no pasar props en cadena de más de 2 niveles sin justificación.
- Iconos exclusivamente de `lucide-react`. No mezclar librerías de iconos.

## 3. Internacionalización (i18n)

### Regla de Oro
- **Textos estáticos de UI** → `src/i18n/ui.ts` + `getLangFromUrl` + `useTranslations`. Nunca hardcodear strings visibles al usuario en templates Astro.
- **Contenido dinámico** (proyectos, perfil) → archivos JSON separados por idioma (`works.es.json`, `works.en.json`). Mantener siempre la misma estructura y los mismos IDs en ambos idiomas.

### Rutas
- Las rutas públicas siguen el patrón `/[lang]/...`. No crear páginas fuera de `src/pages/[lang]/` sin definir la lógica de redirección de idioma.
- Cualquier `href` interno debe inyectar el idioma activo: `` href={`/${lang}/seccion`} ``.

### Admin UI (react-i18next)
- Campos bilingües del formulario (`title_es`/`title_en`, `description_es`/`description_en`) siempre deben mostrarse de forma simultánea y claramente etiquetados.

## 4. Rendimiento y Accesibilidad
- Usar el componente `<Image />` de Astro para **todos** los assets locales: nunca usar `<img>` nativo para recursos en `/public/`.
- Implementar `loading="lazy"` en galerías extensas y mosaicos de `ProjectCard`.
- Cada página debe tener un único `<h1>` descriptivo. Respetar la jerarquía de encabezados.
- Los elementos interactivos (botones, toggles) deben tener atributo `aria-label` cuando no contengan texto visible.
- Puntuar ≥ 90 en Lighthouse Performance antes de considerar un componente listo para producción.
