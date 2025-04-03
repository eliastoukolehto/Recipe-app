# Recipe-app
a website about sharing recipes

## Getting started

create .env file to ./backend according to ./backend/README.md

create dev enviroment with docker:
```
docker compose -f docker-compose.dev.yml up
```
create production build with docker:
```
docker compose -f docker-compose.yml up
```
## Testing
1. build test enviroment with docker:
```
docker compose -f docker-compose.test.yml up -d
```
NOTE: e2e tests will fail once on inital build

2. run e2e tests:
```
docker start -i recipeapp-e2e-test 
```
the coverage report will be created in ./e2e/playwright-report

3. run backend tests

```
docker exec -it recipeapp-backend-test npm run test   
```
Create coverage report to ./backend/coverage
```
docker exec -it recipeapp-backend-test npm run test:coverage   
```

4. run frontend tests
```
docker exec -it recipeapp-frontend-test npm run test   
```
Create coverage report to ./frontend/coverage
```
docker exec -it recipeapp-backend-test npm run test:coverage   
```


## Backlog

[Backlog](https://docs.google.com/spreadsheets/d/1qpRES4P0rhUHArzew5hzpj9N1CH_9HNeeSiLVt2eJF8/edit?usp=sharing)