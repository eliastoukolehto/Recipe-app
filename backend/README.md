# Backend for Recipe app

Run in development mode:
```
npm install

npm run dev
```

## Enviroment:

add .env file to the base of this directory with following variables:
```
PORT=4000                     #GraphQL service port
SECRET=YourSecretKey
DATABASE_URL=MyURL            #URL to PostgreSQL database
TEST_DATABASE_URL=MyTestURL   #URL to PostgreSQL database for tests
ADMIN_USERNAME=admin          #superuser credentials
ADMIN_PASSWORD=admin_password
```
With docker-compose the PostgreSQL URL is `postgres://postgres:mysecretpassword@db/postgres`


## Tests:

run unit tests:
```
npm run test
```
Create coverage report to ./coverage:
```
npm run test:coverage
```