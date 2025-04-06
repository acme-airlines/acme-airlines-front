# Etapa 1: Construcción de la aplicación Angular
FROM node:18-alpine AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código fuente al contenedor
COPY . .

# Exponer el puerto 4200, que es el puerto donde Angular servirá la aplicación
EXPOSE 4200

# Construir la aplicación para producción
RUN npm run build -- --configuration production

# Comando por defecto para ejecutar la aplicación Angular en modo producción
CMD ["npm", "run", "start:prod"]