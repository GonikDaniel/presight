# Production multi-stage build for server

# Builder stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy root manifests for workspaces install
COPY package.json yarn.lock lerna.json ./
# Seed workspace package manifests to satisfy workspaces resolution
COPY server/package.json server/package.json
COPY client/package.json client/package.json

# Install all workspaces dependencies (dev included)
RUN yarn install --frozen-lockfile || yarn install

# Copy sources
COPY tsconfig.base.json ./
COPY server/ server/

# Build the server workspace
RUN yarn --cwd server build

# Runner stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built dist
COPY --from=builder /app/server/dist ./dist
# Copy package.json for metadata
COPY server/package.json ./package.json
# Copy node_modules from builder (includes hoisted deps)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/node_modules ./server/node_modules

EXPOSE 5001

CMD ["node", "dist/index.js"]


