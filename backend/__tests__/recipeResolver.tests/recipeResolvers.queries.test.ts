import { existingUserToken, resetQuery, testServer } from '../helpers/testHelper'
import request from 'supertest'
import { Server } from 'http'
import { recipeTestVariables } from '../helpers/testVariables'
import { createRecipeQuery, recipesQuery } from '../helpers/testQueries'

let httpServer: Server
let token: string

describe('recipeResolver tests', () => {
  beforeAll(async () => {
    httpServer = await testServer
    await request(httpServer).post('/').send({ query: resetQuery })
  })
  describe('searching recipes', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds with exact search', async () => {
      const variables = recipeTestVariables
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
      const variables = recipeTestVariables
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
      const variables = recipeTestVariables
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
