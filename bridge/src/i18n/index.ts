export const translations = {
  es: {
    'auth.unauthorized': 'No autorizado',
    'auth.session_expired': 'Sesión expirada',
    'project.saved': 'Proyecto guardado correctamente',
    'project.not_found': 'Proyecto no encontrado o no autorizado',
    'project.deleted': 'Proyecto eliminado',
    'section.saved': 'Sección guardada',
    'section.deleted': 'Sección eliminada',
    'section.unauthorized': 'No tienes permisos para modificar esta sección',
    'item.saved': 'Item guardado',
    'item.deleted': 'Item eliminado',
    'item.unauthorized': 'No tienes permisos para modificar este item',
    'publish.success': 'Portafolio publicado con éxito',
    'common.error': 'Ha ocurrido un error en el servidor',
    'common.missing_fields': 'Faltan campos obligatorios (ID o Título)',
    'lang.updated': 'Idioma actualizado correctamente',
    'cat.web': 'Diseño Web',
    'cat.3d': 'Modelado 3D',
    'cat.arch': 'Arquitectura',
    'cat.game': 'Gaming'
  },
  en: {
    'auth.unauthorized': 'Unauthorized',
    'auth.session_expired': 'Session expired',
    'project.saved': 'Project saved successfully',
    'project.not_found': 'Project not found or unauthorized',
    'project.deleted': 'Project deleted',
    'section.saved': 'Section saved',
    'section.deleted': 'Section deleted',
    'section.unauthorized': 'Unauthorized to modify this section',
    'item.saved': 'Item saved',
    'item.deleted': 'Item deleted',
    'item.unauthorized': 'Unauthorized to modify this item',
    'publish.success': 'Portfolio published successfully',
    'common.error': 'A server error occurred',
    'common.missing_fields': 'Missing mandatory fields (ID or Title)',
    'lang.updated': 'Language updated successfully',
    'cat.web': 'Web Design',
    'cat.3d': '3D Modeling',
    'cat.arch': 'Architecture',
    'cat.game': 'Gaming'
  }
} as const;

export type TranslationKey = keyof typeof translations.es;
export type Lang = keyof typeof translations;
