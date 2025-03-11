# Design document for Recipe-app
## Stack
### Backend
TypeScript, Express
### Frontend
TypeScript, React, Material UI
### Database
PostgreSQL
### API
Apollo GraphQL
### CI/CD
GitHub Actions, Docker

## Planned Features 
- Users can login to recipe app
- Users can add recipes to recipe app
- Users can create collections of recipes
- Users can make recipes public or private
- Users can comment on recipes

## User Interface
Simple at first, can be improved later

## Database
Database will have two main tables: Users and Recipes. Other tables like Collections and Comments will be conection tables.

## Brances
Protected main branch. Pull requests must pass CI pipeline before being accepted

## Linting
Recommened eslint settings, no bypassing avoidable lint errors

## Tests
Tests in separate directory, test files named respectively to tested files.

## Documentation
Documentation should be clear and kept up to date. Backlog should be kept up to date.

## Other
- focus on easily readable code which requires less comments

