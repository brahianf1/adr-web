#!/bin/bash

# Script de inicialización para producción
# Este script configura el entorno antes de iniciar la aplicación

set -e

echo "🚀 Iniciando configuración de ADR Web..."

# Configurar puerto por defecto si no está definido
export PORT=${PORT:-3000}
echo "📡 Puerto configurado: $PORT"

# Configurar entorno
export NODE_ENV=${NODE_ENV:-production}
echo "🌍 Entorno: $NODE_ENV"

# Verificar archivos de datos
if [ ! -f "/usr/share/nginx/html/data/flashcards.json" ]; then
    echo "⚠️  Advertencia: No se encontraron datos de flashcards"
fi

if [ ! -f "/usr/share/nginx/html/data/quizzes.json" ]; then
    echo "⚠️  Advertencia: No se encontraron datos de quizzes"
fi

# Generar configuración de nginx dinámicamente
echo "⚙️  Configurando Nginx para puerto $PORT..."

cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen $PORT;
    server_name _;
    root /usr/share/nginx/html;
    index index.html index.htm;
    
    # Configuración para SPA (Single Page Application)
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cacheo para archivos estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Archivos de datos JSON
    location /data/ {
        expires 1d;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
    
    # Compresión gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        application/javascript
        application/json
        text/css
        text/javascript
        text/xml
        text/plain;
}
EOF

echo "✅ Nginx configurado correctamente"

# Verificar configuración
nginx -t

echo "🎉 Configuración completada. Iniciando servidor..."

# Iniciar nginx
exec nginx -g "daemon off;"
