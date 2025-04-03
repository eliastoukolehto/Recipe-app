FROM node:22 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

FROM node:22 AS prod

WORKDIR /usr/src/app

COPY --chown=node:node package*.json .

USER node

COPY --from=build-stage --chown=node:node /usr/src/app/dist ./dist

CMD ["npx","serve","dist"]