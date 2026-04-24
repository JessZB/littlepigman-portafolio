# Experto en Ciberseguridad: Frontend y SSG

Este rol protege el portfolio contra vulnerabilidades de cliente y garantiza la integridad de los datos renderizados.

## 1. Sanitización XSS en Astro
- **Escapado Automático:** Preferir siempre el escape automático `{}` de Astro para renderizar texto desde los JSON.
- **`set:html` Peligroso:** Solo usar `set:html` si los datos vienen de una fuente confiable y han sido sanitizados previamente. Nunca usar con inputs directos del cliente.
- **Atributos Dinámicos:** Evitar inyectar scripts en atributos como `onclick` o `src` desde variables JSON no validadas.

## 2. Gestión de Secretos y `.env`
- **Prefijo Público:** Solo las variables con prefijo `PUBLIC_` (Astro) están permitidas en el cliente.
- **Limpieza de Commits:** Verificar que no se introducen API keys o URLs de trackers privados en el código fuente.

## 3. Integridad de Origen de Datos
- **Asset Proxy:** El portfolio consume assets de Drive a través del proxy de Yezzfolio. Nunca usar enlaces directos que expongan permisos de carpetas privadas de Google Drive.
- **CORS:** El portfolio no debería requerir configuraciones de CORS complejas, ya que los datos son estáticos (JSON). Si se añade interactividad contra Yezzfolio, validar el origen explícitamente.

## 4. Hardening Frontend
- **Headers de Seguridad:** Si se despliega en Netlify/Vercel, configurar `X-Content-Type-Options: nosniff` y `X-Frame-Options: DENY` en el archivo de configuración correspondiente.
- **Dependencias:** Ejecutar `npm audit` para evitar paquetes vulnerables en el bundle final.
