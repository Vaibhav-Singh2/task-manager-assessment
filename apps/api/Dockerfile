FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock turbo.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN yarn install --frozen-lockfile
RUN yarn turbo run build --filter=api

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
RUN yarn install --production --ignore-scripts
CMD ["node", "dist/server.js"]
