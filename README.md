# LittlePigman Portafolio - Transer OS

Portafolio web estilo Cyberpunk/JRPG de 16 bits para el artista pixel art **LittlePigman**, diseñado bajo el concepto de sistema operativo retro ("Transer OS").

## Características Principales

*   **Arquitectura:** Construido como una Single Page Application (SPA) nativa utilizando **Astro**.
*   **Diseño Visual:** Estética Cyberpunk oscura con interfaces de cristal biselado (glassmorphism/neumorphism oscuro), tipografía 100% pixelada y efectos de scanline retro.
*   **Gestor de Estados:** Navegación ultra rápida sin recargas de página gestionada por scripts puros inyectados por Astro.
*   **Simulación 3D:** Integración con **Three.js** puro para pre-visualizar maquetas o referencias 3D estilo "Holograma".
*   **Imágenes Optimizadas:** Uso del componente nativo `<Image />` de Astro para un LCP óptimo y control de cargas diferidas (*lazy loading*).

## Estructura del Proyecto

### 1. `src/layouts/`
*   **`TranserOS.astro`:** Es el envoltorio (layout) principal. Define el HTML base, inyecta Tailwind vía CDN (por simplicidad), carga la fuente pixelada (`VT323`) desde Google Fonts y declara las variables CSS globales y las animaciones (como los scanlines y estilos de paneles ciberpunk).

### 2. `src/pages/`
*   **`index.astro`:** El punto de entrada y corazón de la SPA. Une todos los componentes de vista (`ViewProfile`, `ViewDatabase`, `ViewComms`) y contiene toda la lógica de estado JavaScript en tiempo real (manejo de pestañas, apertura de modales, visor 3D paramétrico, reloj y variables de entorno pasadas al cliente).

### 3. `src/components/`
*   **`Sidebar.astro`:** El panel de navegación izquierdo. Muestra la hora del sistema y los botones (`[01] PERFIL`, `[02] DIRECTORIO`, etc.) para interactuar con las diversas vistas de la SPA.
*   **`Panel.astro`:** Un componente envoltorio UI reutilizable que da el estilo de contenedor retro-futurista (bordes de colores, fondo semitransparente oscuro).
*   **`StatBar.astro`:** Las barras de progreso paramétricas (para experiencia o habilidades) mostradas en el perfil.
*   **`ProjectCard.astro`:** La tarjeta de un proyecto visible en la galería del Directorio (con soporte de optimización de imágenes).
*   **Vistas Principales:**
    *   **`ViewProfile.astro`:** Pantalla del perfil. Contiene el nombre, historia y métricas (barras) del usuario, además de una "mochila" de "Herramientas/Software" equipadas.
    *   **`ViewDatabase.astro`:** Pantalla del directorio / portafolio. Funciona en dos estados internos: Lista de proyectos (mosaico de ProjectCards) y Detalle del Proyecto (que renderiza un desglose completo, renders 3D holográficos y una matriz de texturas/animaciones).
    *   **`ViewComms.astro`:** Pantalla de comunicaciones y contacto. Contiene un formulario de contacto *falso* (visual) y las redes sociales con iconos pixelados.

### 4. `src/data/`
Carpeta crítica que actúa como la **base de datos JSON** para inyectar información dinámica al sitio en tiempo de construcción.
*   **`about.json`:** Ficha del personaje/artista (nombre, nivel, bio, métricas, y software).
*   **`socials.json`:** Archivo que contiene los mapeos, iconos de redes y enlaces directos a las cuentas del artista.
*   **`works.json`:** Base de datos estructurada con el trabajo del artista. Soporta tipificación avanzada: matrices `asset-group` para agrupaciones de imágenes sencillas y entidades `3d-model` para invocar renders holográficos Three.js.

### 5. `public/`
Contiene todos los gráficos exportados para consumo directo.
*   **`icons/`:** Iconos pixel-art para programas y redes sociales.
*   **`img/`:** Activos clasificados primariamente en `./pixelarts/` y `./gifts/` (con los sprites animados).

## Comandos

Todos los comandos se corren desde la raíz del proyecto, a través de Node.js:

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala dependencias iniciales. |
| `npm run dev` | Inicia un servidor de desarrollo HTTP local a `localhost:4321`. |
| `npm run build` | Compila tu sitio para producción, empaquetado y optimizado, dejándolo en `./dist/`. |
| `npm run preview` | Previsualiza localmente el archivo compilado en distribución. |

## Mantenimiento

*   **Para agregar imágenes:** Añádelas a `/public/img/...` y luego haz una referencia cruzada agregándola a un nodo dentro de `/src/data/works.json`.
*   **Para cambiar colores temáticos:** Edita `:root` dentro de `src/layouts/TranserOS.astro`.
