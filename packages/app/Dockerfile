FROM node:gallium

WORKDIR /restaurant-reservation

COPY package.json .
COPY packages/app packages/app
COPY packages/shared packages/shared

RUN <<EOF 
npm i -g @angular/cli@14.2.13
npm i
npm run build -w @restaurant-reservation/app
EOF

FROM nginx:latest

COPY --from=build app/dist/aftas-angular /usr/share/nginx/html

EXPOSE 80