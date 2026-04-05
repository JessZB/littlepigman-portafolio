# 👾 Transer OS - Portfolio Design System & Guidelines

Este documento define la arquitectura, el diseño visual y las directrices técnicas para el desarrollo del portafolio interactivo "Transer OS", orientado a un perfil de Pixel Artist & 3D Generalist.

---

## 1. Concepto y Dirección de Arte
* **Temática:** *Cyber-futurista / Tecnológica retro*. Inspirado en las interfaces de GBA/Nintendo DS (específicamente la saga *Mega Man Star Force* y *Battle Network*).
* **Formato UX:** "Single-Screen App". En lugar de una landing page de scroll infinito clásico, funciona como el sistema operativo de un dispositivo personal. 
* **Navegación:** Tab-based (Pestañas). Cambios de vista instantáneos sin recargar la página.
* **Divulgación Progresiva:** La información detallada (como los assets de un proyecto) se oculta hasta que el usuario hace clic, manteniendo la interfaz inicial limpia.

---

## 2. Tokens de Diseño (Paleta y Tipografía)

### 🎨 Paleta de Colores (Purple Synthwave)
Las variables CSS raíz gobiernan todo el sitio. Si el artista desea cambiar un tono, **solo debe modificarse aquí**.

| Variable CSS | Valor Hex | Uso Principal |
| :--- | :--- | :--- |
| `--color-bg-deep` | `#09000c` | Fondo espacial base (profundidad). |
| `--color-dark-purple`| `#1c0217` | Fondo secundario / Pestañas inactivas. |
| `--color-panel-bg` | `#311c48` | Fondo de los paneles principales (cyber-panels). |
| `--color-highlight` | `#4c3f91` | Bordes secundarios y separadores. |
| `--color-panel-border-glow` | `#9145b6` | Efectos hover y UI de software (CSS). |
| `--color-panel-border`| `#b958a5` | **Color principal (Magenta)**. Bordes de paneles, avatares y textos destacados. |
| `--color-danger` | `#ff5677` | Alertas, botones de cierre (X), encabezado de contacto. |
| `--color-accent` | `#ffea00` | **Color de acento (Amarillo)**. Estados "Online", botones importantes, UI de software 3D. |
| `--color-text-main` | `#ffffff` | Texto principal (legibilidad alta). |
| `--color-text-muted` | `#e0b0d5` | Texto secundario (variante clara del magenta). |

### 🔤 Tipografía y Renderizado
* **Fuente Única:** `VT323` (Google Fonts). Ideal para simular interfaces de 32-bits.
* **Regla de Oro (Pixel Art):** Todas las imágenes, canvas y el `body` deben llevar la propiedad de renderizado estricto para evitar desenfoques en pantallas modernas:
    ```css
    image-rendering: pixelated;
    font-smooth: never;
    -webkit-font-smoothing: none;
    ```

---

## 3. Arquitectura de Interfaz (UI / UX)

### Estructura "Boxing"
El diseño se basa en compartimentos estrictamente delimitados.
* **Paneles (`.cyber-panel`):** Contenedores con bordes gruesos, sombras internas (efecto *bevel*/biselado 3D) y un bloque decorativo en la esquina superior izquierda.
* **Móvil (Responsive):** * Se utiliza `h-[100dvh]` para evitar problemas con las barras de navegación de los navegadores móviles.
    * La navegación lateral pasa a ser una barra superior de scroll horizontal (sin barra visual de scroll).

### Vistas Principales
1.  **[01] PERFIL:** Tarjeta de identificación, biografía, barras de parámetros (Stats) y slots de software equipado.
2.  **[02] PROYECTOS (Base de Datos):** Reemplaza la galería tradicional. 
    * *Nivel 1:* Cuadrícula de tarjetas de proyectos.
    * *Nivel 2 (Detalle):* Vista interna estilo "directorio" con botón de retroceso (`[< VOLVER ]`).
3.  **[03] COMMS:** Panel de contacto y estado de red (Freelance ON/OFF).

---

## 4. Estructura de Datos (Inyección vía JSON)
Para la futura integración con Astro o un CMS, **el HTML no debe contener contenido estático quemado**. Todo se renderiza a partir de un objeto JSON estructurado.

### Tipos de "Trabajo Realizado" (Chunks)
Dentro de cada Proyecto (`projects[i].workDone`), los módulos se renderizan distinto según su tipo:

* **Tipo `3d-model`:**
    * Genera un contenedor dividido.
    * Izquierda: Canvas de **Three.js** (visor de modelo interactivo).
    * Derecha: Cuadrícula de assets asociados (texturas, mapas de normales, etc.).
* **Tipo `asset-group`:**
    * Genera una sección categorizada (Ej: "Comida Callejera", "Armas", "Tilesets").
    * Muestra una cuadrícula interna (grid) con los items 2D, título y una breve descripción debajo de cada uno.

---

## 5. Componentes Clave y Funcionalidades Técnicas

* **Three.js Hologram Viewer:** Un componente reutilizable que crea un canvas 3D. Actualmente renderiza un wireframe procedural, preparado para ser sustituido por `GLTFLoader` para cargar archivos `.glb` o `.gltf`.
* **Lightbox Global:** Un modal de pantalla completa (`z-index: 50`) para visualizar cualquier asset 2D o textura en su tamaño original, activable al hacer clic en las imágenes.
* **Gestión de Memoria:** Al salir de la vista detallada de un proyecto, el DOM interno se limpia (`innerHTML = ''`) y los bucles de renderizado 3D se cancelan (`cancelAnimationFrame`) para asegurar un rendimiento óptimo en móviles.

---

## 6. Plan de Migración a Astro (Siguientes Pasos)

Cuando el diseño actual (Vanilla JS + HTML + Tailwind CSS) esté 100% aprobado, la migración a Astro deberá dividirse en los siguientes componentes `.astro`:

1.  **`src/layouts/TranserOS.astro`**: Contendrá el `<body>`, el `<head>`, el fondo, las *scanlines* y el contenedor principal flex/grid.
2.  **`src/components/`**:
    * `Sidebar.astro`: La navegación principal y el reloj.
    * `Panel.astro`: Un *wrapper* reutilizable para las cajas `.cyber-panel`.
    * `StatBar.astro`: Componente que recibe `value` y `colorClass` por props.
    * `ProjectCard.astro`: Tarjeta de la cuadrícula principal.
    * `ThreeViewer.jsx/svelte`: (Recomendable aislar Three.js en un componente de framework cliente usando islas de Astro `client:load` o `client:visible` para mejor rendimiento).
3.  **`src/data/portfolio.json`**: El archivo físico donde vivirá la información del artista.