# Dockerfile

# Stage 1: Build the React frontend
FROM node:18 as build
WORKDIR /app

# Copy all files to the working directory
COPY . .

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Node.js
FROM node:18
WORKDIR /app

# Copy the build files from the first stage
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose the port that the app will run on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]