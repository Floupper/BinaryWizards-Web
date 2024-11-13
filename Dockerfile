# Stage 1: Build the React frontend
FROM node:18 as build
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

# Installer le package 'serve' pour servir l'application
RUN npm install -g serve

# Exposer le port 33034
EXPOSE 33034

# Lancer le serveur avec 'serve'
CMD ["serve", "-s", "build", "-l", "33034"]