FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages
RUN yarn install --frozen-lockfile
RUN yarn turbo run build --filter=web

FROM nginx:alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
