# Build Stage
FROM node:20-alpine AS build
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Enable layer caching by copying package files first
COPY package.json yarn.lock turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

RUN yarn install --frozen-lockfile

# Copy source code and build
COPY apps/api ./apps/api
COPY packages ./packages

RUN yarn turbo run build --filter=api

# Prune devDependencies in-place using yarn workspaces production install
RUN yarn install --production --frozen-lockfile --ignore-scripts && yarn cache clean

# Production Stage
FROM node:20-alpine AS production
WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Security: Create and run as a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs

# Copy pruned node_modules and compiled dist from build stage
COPY --from=build --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=expressjs:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build --chown=expressjs:nodejs /app/apps/api/dist ./dist
COPY --from=build --chown=expressjs:nodejs /app/apps/api/package.json ./

# Switch to the non-root user
USER expressjs

EXPOSE 4000

CMD ["node", "dist/server.js"]
