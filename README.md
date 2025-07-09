# Velocímetro Digital - Docker Deployment

Este documento explica paso a paso cómo crear y ejecutar la imagen y contenedor Docker para la aplicación Angular 20 de Velocímetro Digital.

---

## Requisitos

* **Docker** instalado en tu máquina (Docker Desktop en Windows/Mac o Docker Engine en Linux).
* Código fuente de la aplicación Angular en el directorio raíz del proyecto, incluyendo:

  * `Dockerfile`
  * `nginx.conf`
  * `.dockerignore`

---

## 1. Estructura de archivos clave

```text
Iza_Mateo_Ex2_Velocimetro/
├── src/                # Código fuente Angular
├── Dockerfile          # Instrucciones de build y runtime
├── nginx.conf          # Configuración de Nginx para SPA
├── .dockerignore       # Archivos/folders a excluir del contexto Docker
└── README.md           # Este documento
```

### .dockerignore

```text
node_modules
dist
.git
.vscode
README.md
docker-compose.yml
```

---

## 2. Dockerfile explicado

```dockerfile
# Etapa 1: Build con Node.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar contenido generado a la raíz de Nginx
COPY --from=builder /app/dist/IzaMateo2Ex/ /usr/share/nginx/html/

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# El comando CMD ya viene definido en la imagen base de Nginx
```

* **Etapa 1**: instala dependencias y genera la carpeta `dist/IzaMateo2Ex`.
* **Etapa 2**: copia los ficheros estáticos al directorio donde Nginx los servirá y aplica tu configuración.

---

## 3. Configuración de Nginx (`nginx.conf`)

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  # Archivos estáticos cacheados a largo plazo
  location ~* \.(js|mjs|css|json|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|otf)$ {
    try_files $uri =404;
    access_log off;
    add_header Cache-Control "public, max-age=31536000";
  }

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

* Asegura que todas las rutas del cliente redirijan a `index.html`.
* Cachea recursos estáticos para mejorar el rendimiento.

---

## 4. Construir la imagen Docker

1. Abre una terminal en la raíz del proyecto.
2. Ejecuta:

   ```bash
   docker build -t velocimetro-app:latest .
   ```
3. El flag `-t velocimetro-app:latest` etiqueta la imagen.

---

## 5. Ejecutar el contenedor

1. Para ejecutar en segundo plano y mapear el puerto 80 de Nginx al 8080 local:

   ```bash
   docker run -d --name velocimetro-cnt -p 8080:80 velocimetro-app:latest
   ```
2. Abre tu navegador en `http://localhost:8080`.

---

## 6. Comandos útiles de Docker

* **Listar contenedores en ejecución**:

  ```bash
  docker ps
  ```
* **Ver logs del contenedor**:

  ```bash
  docker logs velocimetro-cnt
  ```
* **Detener contenedor**:

  ```bash
  docker stop velocimetro-cnt
  ```
* **Eliminar contenedor**:

  ```bash
  docker rm velocimetro-cnt
  ```
* **Eliminar imagen**:

  ```bash
  docker rmi velocimetro-app:latest
  ```

---

## 7. Solución de problemas

* Si sigues viendo la página por defecto de Nginx:

  1. Asegúrate de haber copiado **contenido** (`/app/dist/IzaMateo2Ex/`) y no la carpeta entera como subdirectorio.
  2. Entra al contenedor y lista:

     ```bash
     docker exec -it velocimetro-cnt sh
     ls -l /usr/share/nginx/html
     ```
* Verifica que tu build generó la carpeta correcta en `dist/`.

---
