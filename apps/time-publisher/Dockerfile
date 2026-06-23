# apps/time-publisher/Dockerfile

FROM node:22-slim AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy manifests and lock files first to leverage Docker cache
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/time-publisher/package.json apps/time-publisher/
COPY packages/shared/package.json packages/shared/

# Install dependencies
RUN pnpm install

# 1. Copy the rest of the source code
COPY . .

# 2. BUILD THE SHARED PACKAGE FIRST
# This creates the ./packages/shared/dist folder that your backend needs
RUN pnpm --filter @web-event-clock/shared build

# 3. Build the application
# This command will create the 'dist' folder inside the builder's /app directory

RUN pnpm --filter time-publisher build

# 4. VERIFICA togliere poi: Assicurati che la cartella dist esista effettivamente prima del deploy
# RUN ls -la apps/time-publisher/dist && exit 1

# 5. Deploy (ora includerà la cartella dist generata sopra)
RUN pnpm --filter time-publisher --prod deploy /timep --legacy

# --- Production ---
FROM node:22-slim AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Copia tutto il contenuto della cartella di deploy
# Poiché pnpm deploy sposta tutto in /timep, basta copiare il suo contenuto
COPY --from=builder /timep .

# CMD rimane invariato, perché dist/main.js sarà ora in /app/dist/main.js
CMD ["node", "dist/main.js"]
