FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm ci

CMD ["npm", "run", "start:test"] 