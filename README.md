# 📚 ADR Web - Plataforma Educativa

Una plataforma educativa moderna y responsiva construida con React, diseñada específicamente para estudiar administración mediante flashcards, quizzes, resúmenes y glosario.

![Plataforma ADR Web](https://img.shields.io/badge/React-18.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.5-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-green)

## ✨ Características

- 🎯 **Flashcards interactivas** con animaciones flip 3D
- 📝 **Sistema de quizzes** con retroalimentación inmediata
- 📖 **Resúmenes organizados** por temas
- 📚 **Glosario alfabético** con búsqueda avanzada
- 🌙 **Modo oscuro/claro** con persistencia
- 📱 **100% responsive** - optimizado para móviles
- ⚡ **Carga rápida** con Vite
- 🐳 **Dockerizado** para fácil despliegue
- 🎨 **Diseño moderno** inspirado en Duolingo/Notion

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.2** - Biblioteca principal
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación
- **Tailwind CSS** - Framework de estilos
- **Framer Motion** - Animaciones
- **Zustand** - Estado global
- **React Toastify** - Notificaciones
- **React Icons** - Iconografía
- **HeadlessUI** - Componentes accesibles

### Infraestructura
- **Docker** - Contenedorización
- **Nginx** - Servidor web en producción
- **Node.js 18** - Runtime de desarrollo

## 📁 Estructura del Proyecto

```
adr-web/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── Layout.jsx       # Layout principal con navegación
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/               # Páginas principales
│   │   ├── Home.jsx         # Página de inicio
│   │   ├── Flashcards.jsx   # Sistema de flashcards
│   │   ├── Quizzes.jsx      # Sistema de quizzes
│   │   ├── Summaries.jsx    # Resúmenes por tema
│   │   ├── Glossary.jsx     # Glosario alfabético
│   │   └── NotFound.jsx     # Página 404
│   ├── store/               # Estado global con Zustand
│   │   └── index.js         # Stores de tema, estudio y datos
│   ├── App.jsx              # Componente raíz
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── data/                   # Archivos JSON de contenido
│   ├── flashcards.json     # Datos de flashcards
│   ├── quizzes.json        # Datos de quizzes
│   ├── resumenes.json      # Datos de resúmenes
│   └── glosario.json       # Datos del glosario
├── public/                 # Archivos estáticos
├── Dockerfile              # Configuración Docker
├── docker-compose.yml      # Orquestación Docker
├── nginx.conf             # Configuración Nginx
└── README.md              # Este archivo
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Docker (opcional, para contenedorización)

### 📥 Instalación Local

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd adr-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env según sea necesario
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🌐 Despliegue en Digital Ocean

### Despliegue con un solo clic (Recomendado)

[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/brahianf1/adr-web/tree/main)

**Pasos simples:**
1. Haz clic en el botón "Deploy to DigitalOcean"
2. Inicia sesión en tu cuenta de DigitalOcean
3. La configuración se carga automáticamente desde `.do/deploy.template.yaml`
4. Haz clic en "Next" y "Create Resources"
5. ¡Listo! Tu app estará disponible en minutos

### Otras opciones de despliegue

- **App Platform Manual**: Configuración manual en Digital Ocean
- **Droplets con Docker**: Para usuarios avanzados con VPS
- **Dominio personalizado**: Configuración de DNS y SSL

📖 **[Ver guía completa de despliegue](DEPLOYMENT.md)** para instrucciones detalladas.

### 🏗️ Build para Producción

```bash
npm run build
npm run preview
```

### 🐳 Uso con Docker

#### Opción 1: Docker Compose (Recomendado)

```bash
# Producción
docker-compose up -d

# Desarrollo
docker-compose --profile dev up
```

#### Opción 2: Docker manual

```bash
# Construir imagen
docker build -t adr-web .

# Ejecutar contenedor
docker run -d -p 3000:3000 --name adr-web-app adr-web
```

La aplicación estará disponible en `http://localhost:3000`

## 📊 Gestión de Contenido

### Formato de Archivos JSON

#### Flashcards (`data/flashcards.json`)
```json
[
  {
    "id": 1,
    "question": "¿Qué es la administración?",
    "answer": "Es el proceso de planificar, organizar...",
    "topic": "Administración",
    "difficulty": "fácil"
  }
]
```

#### Quizzes (`data/quizzes.json`)
```json
[
  {
    "id": 1,
    "question": "¿Qué significa la 'F' en FODA?",
    "options": ["Factores", "Filosofía", "Fortalezas", "Fines"],
    "correct_option": "Fortalezas",
    "topic": "Análisis FODA",
    "difficulty": "fácil"
  }
]
```

#### Resúmenes (`data/resumenes.json`)
```json
[
  {
    "id": 1,
    "summary": "La administración coordina recursos...",
    "topic": "Administración"
  }
]
```

#### Glosario (`data/glosario.json`)
```json
[
  {
    "term": "Auditoría",
    "definition": "Proceso sistemático para evaluar..."
  }
]
```

### Actualizar Contenido

1. **Editar archivos JSON** en la carpeta `data/`
2. **Con Docker**: Los cambios se reflejan automáticamente gracias al volumen montado
3. **Sin Docker**: Reiniciar el servidor de desarrollo

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_APP_TITLE` | Título de la aplicación | ADR Web - Plataforma Educativa |
| `VITE_APP_DESCRIPTION` | Descripción de la app | Plataforma educativa para estudiar administración |
| `VITE_BASE_PATH` | Ruta base para deployment | `/` |
| `VITE_DEFAULT_THEME` | Tema por defecto | `light` |
| `VITE_DEV_PORT` | Puerto de desarrollo | `3000` |

### Personalización de Temas

El sistema de temas se gestiona con Tailwind CSS y Zustand. Para personalizar:

1. **Colores**: Editar `tailwind.config.js`
2. **Componentes**: Modificar clases en `src/index.css`
3. **Lógica de temas**: Ajustar `src/store/index.js`

## 🎨 Funcionalidades Principales

### 🎯 Flashcards
- Animación flip 3D al hacer clic
- Filtros por tema y dificultad
- Modo aleatorio
- Progreso de estudio
- Navegación con botones o gestos

### 📝 Quizzes
- Preguntas de opción múltiple
- Retroalimentación inmediata
- Sistema de puntuación
- Resultados detallados
- Filtros personalizables

### 📖 Resúmenes
- Organizados por temas
- Búsqueda en tiempo real
- Vista en grid responsiva
- Resaltado de términos buscados

### 📚 Glosario
- Ordenamiento alfabético
- Navegación por letras
- Búsqueda avanzada
- Índice alfabético interactivo

## 🚀 Despliegue en Producción

### Con Docker (Recomendado)

```bash
# Clonar repositorio en servidor
git clone <url-repo>
cd adr-web

# Configurar variables de entorno
cp .env.example .env
# Editar .env para producción

# Ejecutar con Docker Compose
docker-compose up -d

# Verificar estado
docker-compose ps
```

### Sin Docker

```bash
# Build para producción
npm run build

# Servir con nginx/apache
# Copiar contenido de dist/ al directorio web
# Configurar servidor web para SPA (React Router)
```

### Configuración de Servidor Web

Para React Router, configurar el servidor para dirigir todas las rutas a `index.html`:

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🔧 Mantenimiento

### Actualizar Dependencias

```bash
# Verificar versiones desactualizadas
npm outdated

# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit
npm audit fix
```

### Logs y Monitoreo

```bash
# Ver logs con Docker
docker-compose logs -f adr-web

# Health check
curl http://localhost:3000/health
```

### Backup de Datos

```bash
# Respaldar archivos JSON
cp -r data/ backup/data-$(date +%Y%m%d)/
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 🐛 Solución de Problemas

### Problemas Comunes

**Error de permisos con Docker:**
```bash
sudo docker-compose up -d
```

**Puerto ocupado:**
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:80"  # En lugar de 3000:80
```

**Archivos JSON no cargan:**
- Verificar que los archivos estén en `data/`
- Validar formato JSON con herramientas online
- Revisar consola del navegador para errores

**Problemas de build:**
```bash
# Limpiar cache
npm clean-install
rm -rf dist/ node_modules/
npm install
npm run build
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📞 Soporte

Para reportar bugs o solicitar funcionalidades:
1. Crear issue en GitHub
2. Incluir pasos para reproducir
3. Especificar navegador y sistema operativo
4. Adjuntar logs si es necesario

---

**Desarrollado con ❤️ para la educación en administración**
