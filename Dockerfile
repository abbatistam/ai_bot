# Configurar la imagen base
FROM node:18.19.0-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Compilar el proyecto
RUN npm run build

# Exponer el puerto 8080 (o el que uses en tu proyecto Vue.js)
EXPOSE 8080

# Comando para ejecutar la aplicación cuando se inicie el contenedor
CMD [ "npm", "run", "serve" ]