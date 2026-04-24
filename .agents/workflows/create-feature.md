# Workflow: Crear Nueva Funcionalidad (`/create-feature`)

Guía para añadir nuevos componentes o secciones al portfolio Astro.

## Pasos del Workflow

### 1. Definición del Contrato de Datos
- Si la funcionalidad requiere nuevos datos, añadir la estructura al `DATA_SCHEMA.md` primero.
- Crear los campos correspondientes en los archivos JSON de `src/data/`.

### 2. Implementación de Componentes
- Crear el componente en `src/components/`.
- Seguir las reglas de `frontend-expert.md` (variables CSS, estética Transer OS).
- Implementar lógica bilingüe usando `useTranslations`.

### 3. Integración y Layout
- Añadir el componente a la página correspondiente (usualmente `index.astro`).
- Validar que no rompe la responsividad del layout global (`TranserOS.astro`).

### 4. Validación y Review
- Ejecutar `npx astro check`.
- Iniciar el workflow `/review`.
