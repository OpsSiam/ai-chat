# Stage 1: Build the React app
FROM node:20.18.0 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the app using Express
FROM node:20.18.0 AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/build ./build
COPY package*.json ./

# Install only production dependencies (like express)
RUN npm install --only=production

# Copy the Express server code (if located elsewhere, modify the path)
COPY server.js .

# Expose the port the app runs on
EXPOSE 3000

# Run the Express server
CMD ["node", "server.js"]
