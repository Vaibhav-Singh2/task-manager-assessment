# Build Stage
FROM node:20-alpine AS build
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Enable layer caching by copying package files first
COPY package.json yarn.lock turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY apps/web ./apps/web
COPY packages ./packages

# Inject build argument for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the frontend application
RUN yarn turbo run build --filter=web

# Production Stage
FROM nginx:alpine AS production
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from build stage
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
