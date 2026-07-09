# Multi-stage production-ready backend Dockerfile
# Stage 1: Install all dependencies (development + production)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Create minimal production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy packages and install only production dependencies to save space
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Ensure upload and log directories exist
RUN mkdir -p uploads logs

EXPOSE 5000

CMD ["node", "server.js"]
