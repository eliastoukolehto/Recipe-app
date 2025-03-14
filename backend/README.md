Backend for Recipe app

Run in development mode:
```
npm install

npm run dev
```

Enviroment:

add a .env file to the base of the backend with following variables
```
PORT=4000   #GraphQL service port
SECRET=YourSecretKey
DATABASE_URL=MyURL  #URL to PostgreSQL database
TEST_DATABASE_URL=MyTestURL  #URL to PostgreSQL database for tests
```

Tests:

run unit tests
```
npm run test
```