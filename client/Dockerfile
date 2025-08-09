## Production build for client using monorepo workspace install

FROM node:22-alpine AS builder
WORKDIR /app

# Copy root manifests for workspaces install
COPY package.json yarn.lock lerna.json ./
# Seed workspace package manifests to satisfy workspaces resolution
COPY server/package.json server/package.json
COPY client/package.json client/package.json

# Install all workspaces dependencies (dev included)
RUN yarn install --frozen-lockfile || yarn install

# Copy sources needed for client build
COPY tsconfig.base.json ./
COPY client/ client/

# Build the client workspace
RUN yarn --cwd client build

FROM nginx:alpine AS runner
COPY --from=builder /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


