# Multi-stage Dockerfile
# - builder: installs dev deps and runs the build (so `nest` / build tools are available)
# - production: installs only production deps and copies built artifacts

FROM node:18 AS builder
WORKDIR /app

# Install all deps (including dev) for the build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps in the smaller runtime image
COPY package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# If you have runtime assets (public, prisma, etc.), copy them here, e.g.:
# COPY --from=builder /app/public ./public

CMD ["npm", "run", "start:prod"]