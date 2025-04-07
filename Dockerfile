# Base NGINX
FROM nginx:alpine

# Borra contenido HTML por defecto
RUN rm -rf /usr/share/nginx/html/*

# ⚠️ Copia desde el subdirectorio correcto "browser"
COPY dist/acme-airlines-front/browser /usr/share/nginx/html

# Copia config NGINX personalizada (si la tenés)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
