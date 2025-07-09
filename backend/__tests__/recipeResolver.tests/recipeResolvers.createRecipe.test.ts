import { existingUserToken, resetQuery, testServer } from '../helpers/testHelper'
import request from 'supertest'
import { Server } from 'http'
import { recipeTestVariables, recipeTestVariablesFull } from '../helpers/testVariables'
import { createRecipeQuery } from '../helpers/testQueries'

let httpServer: Server
let token: string

describe('recipeResolver tests', () => {
  beforeAll(async () => {
    httpServer = await testServer
    await request(httpServer).post('/').send({ query: resetQuery })
  })

  describe('creating recipe', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds with correct input', async () => {
      const variables = recipeTestVariablesFull
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors).toBeUndefined()
      expect(response.body.data.createRecipe.name).toBe('breakfast porridge in the microwave')
    })

    test('returns correct fields after success', async () => {
      const variables = recipeTestVariablesFull
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors).toBeUndefined()
      const data = response.body.data.createRecipe

      expect(data.id).not.toBeNull()
      expect(data.name).toEqual(recipeTestVariablesFull.name)
      expect(data.description).toEqual(recipeTestVariablesFull.description)
      expect(data.ingredientCategories).toEqual(recipeTestVariablesFull.ingredientCategories)
      expect(data.prepareTime).toEqual(recipeTestVariablesFull.prepareTime)
      expect(data.serving).toEqual(recipeTestVariablesFull.serving)
      expect(data.steps).toEqual(recipeTestVariablesFull.steps)
      expect(data.user.id).not.toBeNull()
      expect(data.user.username).not.toBeNull()
      expect(data.totalLikes).toEqual(0)
      expect(data.likedByCurrentUser).toEqual(false)
    })

    test('succeeds with only necessary fields', async () => {
      const variables = recipeTestVariables
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors).toBeUndefined()
      expect(response.body.data.createRecipe.name).toBe('breakfast porridge in the microwave')
    })

    test('fails without auth token', async () => {
      const variables = recipeTestVariables
      const response = await request(httpServer).post('/').send({ query: createRecipeQuery, variables })

      expect(response.body.errors[0].message).toBe('Unauthorized')
    })

    test('fails without recipe name', async () => {
      const variables = { ...recipeTestVariables, name: null }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails without recipe steps', async () => {
      const variables = { ...recipeTestVariables, steps: [] }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails without recipe ingredients', async () => {
      const variables = { ...recipeTestVariables, ingredientCategories: [] }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails with too many steps', async () => {
      const variables = { ...recipeTestVariables, steps: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })
  })
})
