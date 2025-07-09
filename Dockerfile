# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# 1) Copia contenido de dist directamente a la raíz de Nginx
COPY --from=builder /app/dist/IzaMateo2Ex/ /usr/share/nginx/html/

# 2) Copia tu configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
