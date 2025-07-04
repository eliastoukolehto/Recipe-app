import { existingCustomUserToken, existingUserToken, resetQuery, superuserToken, testServer } from '../helpers/testHelper'
import request from 'supertest'
import { Server } from 'http'
import { recipeTestVariables } from '../helpers/testVariables'
import { createRecipeQuery, deleteRecipeQuery } from '../helpers/testQueries'

let httpServer: Server
let token: string

describe('recipeResolver tests', () => {
  beforeAll(async () => {
    httpServer = await testServer
    await request(httpServer).post('/').send({ query: resetQuery })
  })

  describe('deleting recipe', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds with same user', async () => {
      const variables = recipeTestVariables

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: deleteRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      expect(response2.body.errors).toBeUndefined()
      expect(response2.body.data.deleteRecipe).toBe(true)
    })

    test('fails without auth token', async () => {
      const variables = recipeTestVariables

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: deleteRecipeQuery, variables: { id: recipeId } })

      expect(response2.body.errors[0].message).toBe('Unauthorized')
      expect(response2.body.data.deleteRecipe).not.toBe(true)
    })

    test('fails with wrong token', async () => {
      const variables = recipeTestVariables
      const token2 = await existingCustomUserToken(httpServer, 'TestUser2', 'Password1')

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: deleteRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token2 })

      expect(response2.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
      expect(response2.body.data.deleteRecipe).not.toBe(true)
    })

    test('succeeds with superuser', async () => {
      const variables = recipeTestVariables
      const superToken = await superuserToken(httpServer)

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: deleteRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: superToken })

      expect(response2.body.errors).toBeUndefined()
      expect(response2.body.data.deleteRecipe).toBe(true)
    })
  })
})
