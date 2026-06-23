# Stage 1: Build the frontend
FROM node:22-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy package.json files for all workspace projects (for caching)
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

# 4. BUILD THE SHARED PACKAGE FIRST
# This creates the ./packages/shared/dist folder that your backend needs
RUN pnpm --filter @web-event-clock/shared build

# Build the frontend project
# This will generate the /apps/frontend/dist folder
RUN pnpm --filter frontend build

# Stage 2: Serve the production build with Nginx
FROM nginx:alpine

# Copy the build artifacts from the builder stage
# Vite's default build output is the 'dist' folder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]