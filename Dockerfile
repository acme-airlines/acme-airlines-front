# Etapa 1: Build de Angular
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generar build de producción
RUN npm run build -- --configuration production

# Etapa 2: NGINX para servir el frontend
FROM nginx:alpine

# Copiar archivos de Angular a nginx
COPY --from=build /app/dist/acme-airlines-front /usr/share/nginx/html

# (Opcional) Configuración personalizada de nginx
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
