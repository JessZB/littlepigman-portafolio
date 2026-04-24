# LittlePigman Portafolio - Transer OS

Portafolio web estilo Cyberpunk/JRPG de 16 bits para el artista pixel art **LittlePigman**, diseñado bajo el concepto de sistema operativo retro ("Transer OS").

---

## 🤖 Agente de Codificación — Workflows Disponibles

> Comandos que el agente AI debe seguir al trabajar en este repositorio.
> Cada workflow incluye una **Condición de Cierre** con validación cruzada de los tres expertos (Frontend, Backend, Seguridad) antes de considerarse completo.

| Workflow | Trigger | Descripción |
| :--- | :--- | :--- |
| **Crear Feature** | `/crear-feature` | Diseño UI → Implementación Backend → Integración → Validación cruzada. No finaliza sin checklist de los 3 expertos. |
| **Code Review** | `/code-review` | Análisis de diff → Checklist Frontend → Checklist Backend → Auditoría OWASP. Requiere declaración firmada del Experto en Seguridad. |
| **Deploy Check** | `/deploy-check` | Valida entorno, JWT, pipeline de publicación atómica, build Astro y proxy de Drive. Requiere visto bueno de los 3 roles para confirmar. |

📁 Workflows completos en [`.agents/workflows/`](.agents/workflows/) · Rules de cada experto en [`.agents/rules/`](.agents/rules/)

---

## Características Principales

*   **Arquitectura:** Construido como una Single Page Application (SPA) nativa utilizando **Astro**.
*   **Diseño Visual:** Estética Cyberpunk oscura con interfaces de cristal biselado (glassmorphism/neumorphism oscuro), tipografía 100% pixelada y efectos de scanline retro.
*   **Gestor de Estados:** Navegación ultra rápida sin recargas de página gestionada por scripts puros inyectados por Astro.
*   **Simulación 3D:** Integración con **Three.js** puro para pre-visualizar maquetas o referencias 3D estilo "Holograma".
*   **Imágenes Optimizadas:** Uso del componente nativo `<Image />` de Astro para un LCP óptimo y control de cargas diferidas (*lazy loading*).

## Estructura del Proyecto

### 1. `src/layouts/`
*   **`TranserOS.astro`:** Es el envoltorio (layout) principal. Define el HTML base, carga la fuente pixelada (`VT323`) desde Google Fonts y declara las variables CSS globales y las animaciones (scanlines y estilos de paneles ciberpunk).

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
*   **`works.es.json` / `works.en.json`:** Base de datos bilingüe del trabajo del artista. Generada automáticamente por el pipeline de publicación del Bridge.

### 5. `public/`
Contiene todos los gráficos exportados para consumo directo.
*   **`icons/`:** Iconos pixel-art para programas y redes sociales.
*   **`img/`:** Activos clasificados primariamente en `./pixelarts/` y `./gifts/` (con los sprites animados).

### 6. `bridge/` (Backend y CMS Administrador)
El ecosistema para gestionar dinámicamente todo el portfolio sin necesidad de tocar el código fuente.
*   **Servidor Proxy Node.js/SQLite (`/bridge/src/`):** Backend manejador de base de datos, OAuth2 contra Google Drive (sirve los modelados 3d y texturas mediante Streams seguros) y verificador de permisos JWT de los artistas.
*   **Admin UI (`/bridge/admin-ui/`):** Dashboard programado en React. Permite editar en tiempo real (drag&drop) galerías de trabajos, configurar idiomas separados simultáneos (es/en) y exportar (`Publish`) la información JSON final hacia `/src/data/` de Astro.

## Comandos

Se dividen en los comandos del Frontend público y el Administrador:

### Frontend (Astro) -> Directorio Raíz (`/`)

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala dependencias iniciales. |
| `npm run dev` | Inicia un servidor de desarrollo HTTP local a `localhost:4321`. |
| `npm run build` | Compila tu sitio para producción, empaquetado y optimizado, dejándolo en `./dist/`. |
| `npm run preview` | Previsualiza localmente el archivo compilado en distribución. |

### CMS & Proxy -> Directorio Bridge (`/bridge/`)

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el API Backend (`localhost:3001`). Corre nodemon en `/src/`. |
| `cd admin-ui && npm run dev` | Inicia el Panel Frontend Admin React (`localhost:5173`). |

## Mantenimiento

*   **Publicación de Contenido Nuevo:** A través del panel CMS (`admin-ui`), añade tu diseño en Drive y publícalo. El CMS sobreescribirá en código los `.json` optimizados en la raíz.
*   **Para cambiar colores temáticos:** Edita `:root` dentro de `src/layouts/TranserOS.astro`.
*   *(Nota: Asegúrate de añadir las credenciales OAuth necesarias en el `.env` del bridge antes de loguearte en el CMS, tu user de Google Drive es validado).*
