FROM node:lts-slim as webstatic

WORKDIR /app

COPY ./package.json pnpm-lock.yaml ./

RUN npx pnpm install

COPY . .

RUN npm run build

FROM nginx:latest as nginx

COPY --from=webstatic ./dist/ /usr/share/nginx/html/
COPY --from=webstatic ./docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3004
