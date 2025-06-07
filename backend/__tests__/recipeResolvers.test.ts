import { existingCustomUserToken, existingUserToken, resetQuery } from './testHelper'
import db from '../src/utils/db'
import request from 'supertest'
import { Server } from 'http'
import makeServer from '../app'

let httpServer: Server
let token: string

const createRecipeQuery = /* GraphQL */`
  mutation createRecipe(
    $name: String!
    $description: String
    $ingredientCategories: [IngredientCategoryInput!]!
    $steps: [String!]!,
    $serving: ServingInput,
    $prepareTime: Int
  ) {
  createRecipe (
    name: $name
    description: $description
    ingredientCategories: $ingredientCategories
    steps: $steps
    serving: $serving
    prepareTime: $prepareTime
  ) {
    id
    name
    description
    ingredientCategories {
      name
      ingredients {
        amount
        name
        unit
      }
    }
    steps
    serving {
      amount
      per
      unit
    }
    prepareTime
    user {
      id
      username
    }
  }
}
`

const deleteRecipQuery = /* GraphQL */`
  mutation deleteRecipe( $id: ID! ) { deleteRecipe ( id: $id ) }
`

const recipesQuery = /* GraphQL */`
  query recipes( $search: String ) { recipes ( page: 0, search: $search ) { count rows { name } } }
`

const testVariables = {
  name: 'breakfast porridge in the microwave',
  ingredientCategories: [{
    name: 'porridge',
    ingredients: [{
      name: 'four grain flakes',
      amount: 1,
      unit: 'dl',
    }, {
      name: 'water',
      amount: 2,
      unit: 'dl',
    }],
  }, {
    name: 'toppings',
    ingredients: [{
      name: 'salt',
      amount: 0.5,
      unit: 'tsp',
    }, {
      name: 'butter',
      amount: 25,
      unit: 'g',
    },
    {
      name: 'fresh berries',
      amount: 50,
      unit: 'g',
    }],
  }],
  steps: [
    'Mix porridge ingredients in a bowl',
    'Microwave at 800W for 3 minutes',
    'Top with salt and butter or berries',
  ],
}

const testVariablesFull = {
  ...testVariables,
  description: 'high fiber porridge for breakfast',
  serving: {
    amount: 1,
    per: 3,
    unit: 'dl',
  },
  prepareTime: 5,
}

describe('recipeResolver tests', () => {
  beforeAll(async () => {
    await db.connectToDatabase()
    httpServer = await makeServer()
    await request(httpServer).post('/').send({ query: resetQuery })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  describe('creating recipe', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds with correct input', async () => {
      const variables = testVariablesFull
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors).toBeUndefined()
      expect(response.body.data.createRecipe.name).toBe('breakfast porridge in the microwave')
    })

    test('returns correct fields after success', async () => {
      const variables = testVariablesFull
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors).toBeUndefined()
      const data = response.body.data.createRecipe

      expect(data.id).not.toBeNull()
      expect(data.name).toEqual(testVariablesFull.name)
      expect(data.description).toEqual(testVariablesFull.description)
      expect(data.ingredientCategories).toEqual(testVariablesFull.ingredientCategories)
      expect(data.prepareTime).toEqual(testVariablesFull.prepareTime)
      expect(data.serving).toEqual(testVariablesFull.serving)
      expect(data.steps).toEqual(testVariablesFull.steps)
      expect(data.user.id).not.toBeNull()
      expect(data.user.username).not.toBeNull()
    })

    test('succeeds with only necessary fields', async () => {
      const variables = testVariables
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors).toBeUndefined()
      expect(response.body.data.createRecipe.name).toBe('breakfast porridge in the microwave')
    })

    test('fails without auth token', async () => {
      const variables = testVariables
      const response = await request(httpServer).post('/').send({ query: createRecipeQuery, variables })

      expect(response.body.errors[0].message).toBe('Unauthorized')
    })

    test('fails without recipe name', async () => {
      const variables = { ...testVariables, name: null }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails without recipe steps', async () => {
      const variables = { ...testVariables, steps: [] }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails without recipe ingredients', async () => {
      const variables = { ...testVariables, ingredientCategories: [] }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails with too many steps', async () => {
      const variables = { ...testVariables, steps: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })
  })

  describe('deleting recipe', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds with same user', async () => {
      const variables = testVariables

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: deleteRecipQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      expect(response2.body.errors).toBeUndefined()
      expect(response2.body.data.deleteRecipe).toBe(true)
    })

    test('fails without auth token', async () => {
      const variables = testVariables

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: deleteRecipQuery, variables: { id: recipeId } })

      expect(response2.body.errors[0].message).toBe('Unauthorized')
      expect(response2.body.data.deleteRecipe).not.toBe(true)
    })

    test('fails with wrong token', async () => {
      const variables = testVariables
      const token2 = await existingCustomUserToken(httpServer, 'TestUser2', 'Password1')

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: deleteRecipQuery, variables: { id: recipeId } })
        .set({ Authorization: token2 })

      expect(response2.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
      expect(response2.body.data.deleteRecipe).not.toBe(true)
    })
  })

  describe('searching recipes', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds with exact search', async () => {
      const variables = testVariables
      await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const response = await request(httpServer)
        .post('/')
        .send({ query: recipesQuery, variables: { search: 'breakfast porridge in the microwave' } })

      expect(response.body.data.recipes.rows).toHaveLength(1)
    })

    test('succeeds with partial search', async () => {
      const variables = testVariables
      await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const response = await request(httpServer)
        .post('/')
        .send({ query: recipesQuery, variables: { search: 'PORRIDGE' } })

      expect(response.body.data.recipes.rows).toHaveLength(1)
    })

    test('fails with invalid search', async () => {
      const variables = testVariables
      await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const response = await request(httpServer)
        .post('/')
        .send({ query: recipesQuery, variables: { search: 'macaroni and cheese' } })

      expect(response.body.data.recipes.rows).toHaveLength(0)
    })
  })
})
