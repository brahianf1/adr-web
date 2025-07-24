# Digital Ocean App Platform - Configuración de despliegue

## Archivos de configuración

### `.do/deploy.template.yaml`
Configuración automática para el botón "Deploy to DigitalOcean"

### Configuración aplicada:
- **Nombre**: adr-web-educational-platform
- **Región**: New York (nyc)
- **Puerto**: 3000 (configurable via PORT env var)
- **Instancia**: Basic XS ($5/mes)
- **Auto-deploy**: Habilitado desde branch main

### Variables de entorno configuradas:
- `PORT=3000` - Puerto de la aplicación
- `NODE_ENV=production` - Entorno de producción
- `VITE_APP_NAME=ADR Educational Platform` - Nombre de la app

## Proceso de despliegue automático

1. **Build del contenedor Docker**
2. **Configuración dinámica de Nginx** con el puerto de Digital Ocean
3. **Servir archivos estáticos** optimizados
4. **Health checks** automáticos
5. **SSL automático** con Let's Encrypt

## Personalización

Para modificar la configuración:

1. **Fork el repositorio**
2. **Modifica `.do/deploy.template.yaml`**
3. **Actualiza las variables de entorno**
4. **Usa tu repositorio** en el botón de deploy

## Monitoreo

Digital Ocean App Platform proporciona:
- **Logs** en tiempo real
- **Métricas** de CPU y memoria
- **Alertas** automáticas
- **Escalado** automático opcional
