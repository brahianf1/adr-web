# Despliegue en Digital Ocean

Este documento explica cómo desplegar la plataforma educativa ADR Web en Digital Ocean usando diferentes métodos.

## Método 1: Despliegue con un solo clic (Recomendado)

[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/brahianf1/adr-web/tree/main)

### Pasos:

1. **Haz clic en el botón "Deploy to DigitalOcean" de arriba**
2. **Inicia sesión** en tu cuenta de DigitalOcean (o crea una nueva)
3. **Configuración automática**: La configuración se cargará desde `.do/deploy.template.yaml`
4. **Revisa la configuración**:
   - **App Name**: `adr-web-educational-platform`
   - **Region**: New York (nyc)
   - **Plan**: Basic ($5/mes)
   - **Puerto**: 3000
5. **Haz clic en "Next"** y luego en **"Create Resources"**
6. **Espera el despliegue** (aproximadamente 5-10 minutos)
7. **¡Listo!** Tu aplicación estará disponible en la URL proporcionada

## Método 2: App Platform Manual

### Requisitos previos:
- Cuenta de Digital Ocean
- Repositorio de GitHub con el código

### Pasos:

1. **Accede a Digital Ocean**:
   - Ve a [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Inicia sesión en tu cuenta

2. **Crear nueva App**:
   - Haz clic en "Create" → "Apps"
   - Selecciona "GitHub" como fuente

3. **Configurar el repositorio**:
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `adr-web`
   - Branch: `main`
   - Auto-deploy: Habilitado (recomendado)

4. **Configurar el servicio**:
   ```yaml
   Name: adr-web-service
   Type: Web Service
   Source: Dockerfile
   Port: 3000
   Instance Size: Basic ($5/mes)
   Instance Count: 1
   ```

5. **Variables de entorno**:
   ```
   PORT=3000
   NODE_ENV=production
   VITE_APP_NAME=ADR Educational Platform
   ```

6. **Finalizar**:
   - Review and Create
   - Esperar el despliegue

## Método 3: Droplets con Docker

### Para usuarios avanzados que prefieren VPS tradicional

1. **Crear Droplet**:
   - Ubuntu 20.04 LTS o superior
   - Mínimo 1GB RAM
   - Región de tu preferencia

2. **Instalar Docker**:
   ```bash
   # Actualizar sistema
   sudo apt update && sudo apt upgrade -y
   
   # Instalar Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Instalar Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Clonar repositorio**:
   ```bash
   git clone https://github.com/brahianf1/adr-web.git
   cd adr-web
   ```

4. **Configurar variables de entorno**:
   ```bash
   echo "PORT=3000" > .env
   echo "NODE_ENV=production" >> .env
   echo "VITE_APP_NAME=ADR Educational Platform" >> .env
   ```

5. **Desplegar**:
   ```bash
   docker-compose up -d
   ```

6. **Configurar firewall**:
   ```bash
   sudo ufw allow 3000
   sudo ufw enable
   ```

## Configuración de dominio personalizado

### Para App Platform:

1. **En el dashboard de tu app**:
   - Ve a "Settings" → "Domains"
   - Add Domain → Ingresa tu dominio
   - Configura los DNS records según las instrucciones

2. **Configurar DNS**:
   ```
   Type: CNAME
   Name: www (o @)
   Value: [url-proporcionada-por-digitalocean]
   ```

### Para Droplets:

1. **Instalar Nginx Proxy Manager** (recomendado):
   ```bash
   # Crear docker-compose para proxy
   mkdir nginx-proxy && cd nginx-proxy
   
   # Crear configuración
   cat > docker-compose.yml << EOF
   version: '3'
   services:
     app:
       image: 'jc21/nginx-proxy-manager:latest'
       restart: unless-stopped
       ports:
         - '80:80'
         - '443:443'
         - '81:81'
       volumes:
         - ./data:/data
         - ./letsencrypt:/etc/letsencrypt
   EOF
   
   # Iniciar
   docker-compose up -d
   ```

2. **Configurar proxy**:
   - Accede a `http://tu-ip:81`
   - Login: admin@example.com / changeme
   - Crear proxy host para tu dominio → localhost:3000

## Monitoreo y mantenimiento

### App Platform:
- **Logs**: Disponibles en el dashboard de Digital Ocean
- **Métricas**: CPU, memoria, requests automáticamente monitoreados
- **Escalado**: Automático basado en la carga
- **SSL**: Automático con Let's Encrypt

### Droplets:
- **Logs**: `docker-compose logs -f`
- **Recursos**: `docker stats`
- **Backup**: Snapshots de Digital Ocean
- **SSL**: Configurado a través de Nginx Proxy Manager

## Solución de problemas

### Error de construcción:
```bash
# Verificar logs de construcción
docker-compose logs adr-web

# Reconstruir imagen
docker-compose build --no-cache
```

### Problemas de puerto:
```bash
# Verificar puertos ocupados
sudo netstat -tlnp | grep :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Puerto externo:interno
```

### Problemas de memoria:
- Para App Platform: Aumentar el instance size
- Para Droplets: Aumentar RAM del droplet

## Costos estimados

### App Platform:
- **Basic**: $5/mes (512MB RAM, 1 vCPU)
- **Professional**: $12/mes (1GB RAM, 1 vCPU)
- **Bandwidth**: Incluido hasta 100GB/mes

### Droplets:
- **Basic**: $6/mes (1GB RAM, 1 vCPU, 25GB SSD)
- **Regular**: $12/mes (2GB RAM, 1 vCPU, 50GB SSD)
- **Bandwidth**: 1TB incluido

## Recomendaciones

1. **Para principiantes**: Usar App Platform con despliegue de un clic
2. **Para desarrollo**: App Platform con auto-deploy desde GitHub
3. **Para producción**: App Platform Professional o Droplet Regular
4. **Para múltiples aplicaciones**: Droplet con Docker Compose

## Soporte

- **Documentación oficial**: [docs.digitalocean.com](https://docs.digitalocean.com)
- **Comunidad**: [community.digitalocean.com](https://community.digitalocean.com)
- **Soporte técnico**: Disponible en planes pagados
