# Stage 1: Build the React frontend
FROM node:18 AS build
WORKDIR /app

# Copy all files to the working directory
COPY ./binarywizards-webapp /app

# Install dependencies
RUN npm install

# Build the React app (Assure-toi que le script 'build' existe dans package.json)
RUN npm run build

# Stage 2: Serve the app using 'npx serve'
FROM node:18
WORKDIR /app

# Copy the build files from the first stage
COPY --from=build /app/build ./build

COPY ./binarywizards-webapp/server.js /app/server.js

# Installer le package 'express' pour servir l'application
RUN npm install express

# Lancer le serveur avec 'serve'
CMD ["node", "server.js"]