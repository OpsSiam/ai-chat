# Stage 1: Build Stage
FROM node:20.18-alpine AS build

# Set the working directory
WORKDIR /app

# Install dependencies for native module compilation
RUN apk add --no-cache python3 make g++

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for native modules)
RUN yarn install

# Copy the rest of your project files
COPY . .

# Stage 2: Production Stage
FROM node:20.18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy the necessary files from the build stage
COPY --from=build /app /app

# Remove any development dependencies and tools if necessary
# This command will ensure only production dependencies remain
RUN yarn install --production --frozen-lockfile

# Expose the port your app listens on
EXPOSE 5001

# Set environment variables for production
ENV NODE_ENV=production

# Start the Node.js application
CMD ["node", "index.js"]
