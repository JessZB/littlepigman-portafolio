export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.profile': '[01] PERFIL',
    'nav.directory': '[02] DIRECTORIO',
    'nav.comms': '[03] COMUNICACIÓN',
    
    'profile.class': 'CLASE',
    'profile.status': 'ESTADO',
    'profile.parameters': 'PARÁMETROS',
    'profile.software': 'HERRAMIENTAS/SOFTWARE',
    'profile.empty': 'VACÍO',
    
    'db.title': 'Directorio',
    'db.status': 'SISTEMA LISTO',
    
    'proj.goBack': '[< VOLVER ]',
    'proj.loading': 'ACCEDIENDO...',
    'proj.role': '> ROL',
    'proj.log': 'Registro de Trabajo Realizado',
    'proj.assets': 'ASSETS (TEXTURAS)',
    
    'comms.title': 'Establecer Enlace (Comunicaciones)',
    'comms.label1': 'INGRESE DATOS DE TRANSMISIÓN:',
    'comms.placeholder1': 'TU_NOMBRE...',
    'comms.placeholder2': 'MENSAJE...',
    'comms.submit': '-> ENVIAR PAQUETE <-',
    'comms.socials': 'REDES / ENLACES'
  },
  en: {
    'nav.profile': '[01] PROFILE',
    'nav.directory': '[02] DIRECTORY',
    'nav.comms': '[03] COMM-LINK',
    
    'profile.class': 'CLASS',
    'profile.status': 'STATUS',
    'profile.parameters': 'PARAMETERS',
    'profile.software': 'TOOLS/SOFTWARE',
    'profile.empty': 'EMPTY',
    
    'db.title': 'Directory',
    'db.status': 'SYSTEM READY',
    
    'proj.goBack': '[< RETURN ]',
    'proj.loading': 'ACCESSING...',
    'proj.role': '> ROLE',
    'proj.log': 'Work Log',
    'proj.assets': 'ASSETS (TEXTURES)',
    
    'comms.title': 'Establish Link (Comms)',
    'comms.label1': 'ENTER TRANSMISSION DATA:',
    'comms.placeholder1': 'YOUR_NAME...',
    'comms.placeholder2': 'MESSAGE...',
    'comms.submit': '-> SEND PACKAGE <-',
    'comms.socials': 'SOCIAL LINKS'
  },
} as const;
