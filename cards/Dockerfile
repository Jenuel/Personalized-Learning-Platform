# Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app (TypeScript to JavaScript in /dist)
RUN npm run build

# -------------------
# Production Stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled app from builder
COPY --from=builder /usr/src/app/dist ./dist

# Copy any other necessary files (e.g., config)
# COPY ./config ./config  # Uncomment if needed

# Expose port (change if using a different port)
EXPOSE 3000

# Run the app using npm run start (runs dist/main.js)
CMD ["npm", "run", "start"]
