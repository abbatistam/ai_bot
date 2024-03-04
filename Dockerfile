# Establece la imagen base
FROM node:18 as build-stage

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Configura las variables de entorno para el proceso de construcción
ARG VITE_API_URL
ENV VITE_API_URL $VITE_API_URL

# Compila el proyecto de Vue.js
RUN npm run build

# Establece la segunda etapa de construcción para servir los archivos estáticos
FROM nginx:1.21-alpine as production-stage

# Copia los archivos generados en la etapa de compilación al directorio de trabajo de nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 80

# Ejecuta el servidor de nginx
CMD ["nginx", "-g", "daemon off;"]