# Data Schema — littlepigman-portafolio

Documento de contrato de datos. Define la estructura exacta de los JSON que consume cada componente Astro.
Cualquier CMS (como [Yezzfolio](https://github.com/JessZB/yezzfolio)) que quiera generar contenido para este portfolio **DEBE** respetar estas estructuras.

---

## Estructura de archivos

```
src/data/
├── profile.es.json     ← Perfil del artista (español)
├── profile.en.json     ← Perfil del artista (inglés)
├── works.es.json       ← Proyectos con secciones (español)
├── works.en.json       ← Proyectos con secciones (inglés)
└── gallery.json        ← Galería de imágenes (sin idioma)
```

> **Nota:** Los archivos `about.[lang].json` y `socials.[lang].json` son legacy y están siendo deprecados en favor de `profile.[lang].json`.

---

## `profile.[lang].json`

**Consumido por:** `src/components/ViewProfile.astro`, `src/components/ViewComms.astro`, `src/layouts/TranserOS.astro`

```json
{
  "version": "1.1",
  "meta": {
    "site_title": "string",           // Título del sitio para SEO
    "description": "string",          // Meta description SEO
    "favicon_drive_id": "string|null",// ID de Google Drive o null
    "avatar_drive_id": "string|null"  // ID de Google Drive o null
  },
  "identity": {
    "name": "string",                 // REQUIRED: Nombre del artista
    "class": "string",                // REQUIRED: Rol/especialidad (ej. "PIXEL ART & GAME DESIGN")
    "level": "number",                // REQUIRED: Nivel numérico (ej. 99)
    "status": "string",               // REQUIRED: Estado (ej. "ONLINE")
    "bio": "string",                  // REQUIRED: Biografía corta
    "avatar": "string|null"           // URL absoluta de la imagen o null
  },
  "theme": {},                        // Objeto de tema (reservado para extensiones futuras)
  "stats": [
    {
      "name": "string",               // REQUIRED: Nombre del stat (ej. "SPRITES (ANIM)")
      "value": "number",              // REQUIRED: Valor 0-100
      "class": "string"               // CSS class para colorear la barra (ej. "exp", "ui", "")
    }
  ],
  "software": [
    {
      "id": "string",                 // REQUIRED: Identificador único (ej. "ASE")
      "name": "string",               // REQUIRED: Nombre visible (ej. "Aseprite")
      "icon": "string|null",          // URL absoluta del icono (cuadrado, recomendado 48x48) o null
      "color": "string"               // CSS color/variable (ej. "var(--color-accent)")
    }
  ],
  "socials": [
    {
      "name": "string",               // REQUIRED: Nombre de la red social
      "link": "string",               // REQUIRED: URL. Usar "#" si no hay link
      "icon": "string|null"           // URL absoluta del icono pixel art o null
    }
  ],
  "contact": {
    "title": "string",                // Título de la sección de contacto
    "description": "string",          // Descripción/disclaimer de contacto
    "email": "string|null"            // Email de contacto (opcional)
  }
}
```

### Componentes que lo usan

| Campo | Componente | Notas |
|-------|-----------|-------|
| `identity.*` | `ViewProfile.astro` | `avatar` null → muestra placeholder SVG |
| `stats[]` | `ViewProfile.astro` → `StatBar.astro` | `class` controla el color de la barra |
| `software[]` | `ViewProfile.astro` | `icon` null → muestra caja genérica |
| `socials[]` | `ViewComms.astro` | `icon` null → muestra icono de link genérico |
| `contact.*` | `ViewComms.astro` | Con fallback a claves i18n si vacío |
| `meta.*` | `TranserOS.astro` | Para `<title>` y `<meta description>` |

---

## `works.[lang].json`

**Consumido por:** `src/pages/[lang]/index.astro` (tarjetas de proyectos + modales de detalle)

```json
[
  {
    "id": "string",                   // REQUIRED: Slug único del proyecto (ej. "mi-proyecto")
    "title": "string",                // REQUIRED: Título del proyecto
    "category": "string",             // REQUIRED: Categoría (ej. "Diseño Web", "3D Art")
    "thumbnail": "string|null",       // URL de miniatura o null → muestra placeholder
    "role": "string",                 // REQUIRED: Rol del artista en el proyecto
    "description": "string",          // REQUIRED: Descripción corta
    "workDone": [                     // Array de secciones de trabajo (mínimo 0)
      // Ver tipos de sección abajo
    ]
  }
]
```

### Tipos de sección en `workDone[]`

#### Tipo: `asset-group` — Galería de imágenes

```json
{
  "type": "asset-group",
  "groupTitle": "string",             // REQUIRED: Título del grupo
  "description": "string|null",       // Descripción opcional
  "items": [
    {
      "title": "string",              // REQUIRED: Nombre del asset
      "img": "string|null",           // URL de imagen o null → placeholder SVG
      "desc": "string|null"           // Descripción corta opcional
    }
  ]
}
```

#### Tipo: `gltf-model` — Visor 3D (formato GLTF/GLB)

```json
{
  "type": "gltf-model",
  "title": "string",                  // REQUIRED: Título de la sección
  "description": "string|null",       // Descripción opcional
  "modelUrl": "string|null"           // URL del archivo .gltf/.glb o null
}
```

#### Tipo: `3d-model` — Visor 3D con Texturas (formato propietario)

```json
{
  "type": "3d-model",
  "title": "string",                  // REQUIRED: Título
  "description": "string|null",       // Descripción opcional
  "modelPlaceholderColor": "number",  // Color hex numérico para el placeholder (ej. 12146341)
  "textures": [
    {
      "name": "string",               // REQUIRED: Nombre de la textura
      "img": "string|null"            // URL de la textura (PNG/JPEG) o null
    }
  ]
}
```

---

## `gallery.json`

**Consumido por:** `src/pages/[lang]/index.astro` (sección galería/database)
**Sin variante de idioma** — solo existe un archivo.

```json
[
  {
    "title": "string",                // REQUIRED: Nombre de la imagen
    "image": "string",                // REQUIRED: Ruta relativa desde /public o URL absoluta
    "category": "string"              // REQUIRED: Categoría para filtrado (ej. "PIXEL ARTS", "ANIMATIONS")
  }
]
```

---

## Reglas de Compatibilidad

1. **Campos marcados `REQUIRED`** — Si están vacíos o ausentes, el componente mostrará un estado de error o fallback visible.
2. **`null` vs `undefined`** — Siempre usar `null` explícito para campos opcionales sin valor. `undefined` puede romper el build de Astro.
3. **URLs de assets** — Deben ser URLs absolutas (`http://...`) o rutas relativas desde `/public/`. No enviar IDs sin procesar de Google Drive.
4. **Idioma** — Mantener exactamente los mismos IDs de proyectos en `works.es.json` y `works.en.json`. El orden también debe ser idéntico.
5. **Encoding** — UTF-8. Sin BOM.
