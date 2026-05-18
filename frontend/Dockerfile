# 1. Base Alpine Image
FROM node:20-alpine AS alpine
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# 2. Prune Workspace for Web
FROM alpine AS pruner
RUN yarn global add turbo@^2
COPY . .
RUN turbo prune web --docker

# 3. Install Dependencies & Build
FROM alpine AS builder
# Inject build argument for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package.jsons and lockfile to cache dependencies
COPY --from=pruner /app/out/json/ .
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run build --filter=web

# 4. Production Runner
FROM nginx:alpine AS production
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Add custom Nginx configuration to support SPA routing
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
