FROM node:gallium

WORKDIR /restaurant-reservation

COPY package.json .
COPY packages/api packages/api
COPY packages/shared packages/shared

RUN <<EOF 
npm i
npm run build -w @restaurant-reservation/api
EOF

CMD cd packages/api; node dist/api/src/index.js