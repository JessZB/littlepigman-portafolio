# Arquitectura de LittlePigman Portfolio CMS

El proyecto está dividido en dos grandes bloques que iteran sobre la estética y el funcionamiento del portafolio del artista "LittlePigman":

## 1. El Frontend Público (Astro + Vanilla JS)
Un portafolio Single Page Application (SPA) sin frameworks pesados, optimizado con **Astro**.
Ubicado en la raíz del proyecto (`/`).

**Características:**
- Arquitectura de renderizado en el servidor SSG.
- Estilo "Transer OS" retro-ciberpunk (pixel art, scanlines, glassmorphism).
- Motor de i18n dinámico (idioma) mediante la ruta (ej. `/es/` o `/en/`). Usa contenido estático en `src/data/`.
- Visor de imágenes optimizadas de galería y renders holográficos 3D web integrados nativamente.
- Archivos clave: `src/pages/index.astro`, `src/data/*.json`, `src/layouts/TranserOS.astro`.

## 2. El Bridge Backend (Express + SQLite)
Un CMS remoto diseñado a medida (`/bridge`). El núcleo que maneja la autenticación y abstrae Google Drive.

**Misión principal:**
- Almacenar la estructura jerárquica de proyectos, secciones e items en su base de datos local SQLite (`portfolio.db`).
- Proxy Seguro de Google Drive (`/api/file/:id`). Para ahorrar costes de hosting, todos los assets pesados y modelos se suben a Google Drive. El bridge hace de API Streaming que expone las imágenes bajo el dominio local validando permisos, lo que evita que los enlaces públicos expiren.

**Características de Seguridad:**
- **OAuth2**: Sistema de login acoplado directamente a la cuenta de Google del artista.
- **JWT Sessions**: Control de sesión en `/auth/session.ts` y middleware que redirige (401) si expira.
- **Drive Verification**: Autenticación estricta: antes de guardar un enlace de Google Drive al CMS, verifica (`capabilities` y `permissions`) contra la Google ID alojada, impidiendo cargar assets de cuentas ajenas.

## 3. El Admin UI (React + Vite)
El panel de edición para el CMS (`/bridge/admin-ui`).

**Características:**
- Mapea directamente el CRUD sobre la db usando el API del Bridge.
- **Soporte Bilingüe (i18n)**: Totalmente integrado con `react-i18next` permite tener una UI doble (ES/EN) y llenar los campos dinámicos `title_es`, `title_en`, etc., de forma simultánea pero separada dentro del formulario de un item.
- Interfaz gráfica basada en Material UI + Lucide-react Icons, manteniendo una estética limpia y oscura "Premium".
- Drag & drop de listados de galerías mediantes `@dnd-kit`.

## 4. Pipeline de Publicación (Generator)
- A través de la acción de **Publicar** dentro del Admin UI, éste dispara un comando (`/api/admin/publish`) en el Bridge.
- El Bridge ejecuta la recolección total de datos desde SQLite, cruza las traducciones inglesas y españolas, y exporta dos archivos gigantescos: `works.es.json` y `works.en.json`.
- Éstos son pasados directamente a `/src/data/` del Astro, listo para ser consumido en la próxima recarga de construcción SSG.
