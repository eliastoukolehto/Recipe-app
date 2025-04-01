FROM mcr.microsoft.com/playwright:v1.51.1

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "run", "test"] 