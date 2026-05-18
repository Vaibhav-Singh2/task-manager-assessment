# 1. Base Alpine Image
FROM node:20-alpine AS alpine
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# 2. Prune Workspace for API
FROM alpine AS pruner
RUN yarn global add turbo@^2
COPY . .
RUN turbo prune api --docker

# 3. Install Dependencies & Build
FROM alpine AS builder
# Copy package.jsons and lockfile to cache dependencies
COPY --from=pruner /app/out/json/ .
RUN yarn install --frozen-lockfile

# Copy source code and build
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run build --filter=api

# Prune devDependencies in-place using yarn workspaces production install
RUN yarn install --production --frozen-lockfile --ignore-scripts && yarn cache clean

# 4. Production Runner
FROM alpine AS runner
ENV NODE_ENV=production

# Security: Create and run as a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs

# Copy pruned node_modules and compiled dist from build stage
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=expressjs:nodejs /app/backend/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/backend/package.json ./

# Switch to the non-root user
USER expressjs

EXPOSE 4000
CMD ["node", "dist/server.js"]
