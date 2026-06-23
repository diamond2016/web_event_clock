# apps/backend/Dockerfile
FROM node:22-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 1. Copy workspace configuration
COPY .npmrc ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# 2. Copy all package.json files (for caching)
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/


# 3. Install dependencies
RUN pnpm install
# Copy source code (This is where the .dockerignore matters)
COPY . .

# 4. BUILD THE SHARED PACKAGE FIRST
# This creates the ./packages/shared/dist folder that your backend needs
RUN pnpm --filter @web-event-clock/shared build

# 5. Build the backend package
RUN pnpm --filter backend build

# 6. DEPLOY the backend package
# This creates a standalone folder at /prod containing ONLY the backend 
# and its production dependencies (no symlinks).
RUN pnpm --filter backend --prod deploy /prod --legacy


# Production stage
FROM node:22-slim AS release

WORKDIR /app

# Copy the deployed folder from the builder stage
# pnpm deploy puts the contents of apps/backend into /prod
# This folder contains the dist, node_modules, and package.json with NO symlinks.
COPY --from=builder /prod .


# Set environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Since pnpm deploy puts the contents of apps/backend into /prod,
# the dist folder is now at /app/dist
CMD ["node", "dist/main.js"]

