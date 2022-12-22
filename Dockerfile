FROM node:lts-slim as webstatic

WORKDIR /app

COPY ./package.json pnpm-lock.yaml ./

RUN npx pnpm install

COPY . .

RUN npm run build

RUN pwd && ls -al

FROM nginx:latest as nginx

COPY --from=webstatic /app/dist/ /usr/share/nginx/html/
COPY --from=webstatic /app/docker/nginx.conf /etc/nginx/conf.d/

EXPOSE 3004
