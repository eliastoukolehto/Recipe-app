import { existingCustomUserToken, existingUserToken, resetQuery, testServer } from '../helpers/testHelper'
import request from 'supertest'
import { Server } from 'http'
import { recipeTestVariables } from '../helpers/testVariables'
import { createRecipeQuery, likeRecipeQuery, recipeLikesQuery, removeRecipeLikeQuery } from '../helpers/testQueries'

let httpServer: Server
let token: string

describe('recipeResolver tests', () => {
  beforeAll(async () => {
    httpServer = await testServer
    await request(httpServer).post('/').send({ query: resetQuery })
  })

  describe('liking recipe', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds with existing recipe', async () => {
      const variables = recipeTestVariables
      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      expect(response2.body.errors).toBeUndefined()
      expect(response2.body.data.likeRecipe.recipeId).toBe(recipeId)
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
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })

      expect(response2.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails with invalid id', async () => {
      const variables = recipeTestVariables
      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id as number

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId + 1 } })
        .set({ Authorization: token })

      expect(response2.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('succeeds with different user', async () => {
      const variables = recipeTestVariables
      const token2 = await existingCustomUserToken(httpServer, 'TestUser2', 'Password1')

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token2 })

      expect(response2.body.data.likeRecipe.recipeId).toBe(recipeId)
    })

    test('fails with like already existing', async () => {
      const variables = recipeTestVariables
      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id as number

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      expect(response2.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('shows correctly with multiple likes', async () => {
      const variables = recipeTestVariables
      const token2 = await existingCustomUserToken(httpServer, 'TestUser2', 'Password1')

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token2 })

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: recipeLikesQuery, variables: { id: recipeId } })
        .set({ Authorization: token2 })

      expect(response2.body.data.recipe.totalLikes).toEqual(2)
      expect(response2.body.data.recipe.likedByCurrentUser).toEqual(true)
    })

    test('is not liked by currentUser if liked by others', async () => {
      const variables = recipeTestVariables
      const token2 = await existingCustomUserToken(httpServer, 'TestUser2', 'Password1')

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: recipeLikesQuery, variables: { id: recipeId } })
        .set({ Authorization: token2 })

      expect(response2.body.data.recipe.totalLikes).toEqual(1)
      expect(response2.body.data.recipe.likedByCurrentUser).toEqual(false)
    })

    test('is not liked by currentUser if not logged in', async () => {
      const variables = recipeTestVariables

      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: recipeLikesQuery, variables: { id: recipeId } })

      expect(response2.body.data.recipe.totalLikes).toEqual(1)
      expect(response2.body.data.recipe.likedByCurrentUser).toEqual(false)
    })
  })

  describe('removing recipe like', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
      token = await existingUserToken(httpServer)
    })

    test('succeeds when like exists', async () => {
      const variables = recipeTestVariables
      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: removeRecipeLikeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      expect(response2.body.errors).toBeUndefined()
      expect(response2.body.data.removeRecipeLike).toEqual(true)
    })

    test('fails without auth token', async () => {
      const variables = recipeTestVariables
      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: removeRecipeLikeQuery, variables: { id: recipeId } })

      expect(response2.body.errors[0].message).toBe('Unauthorized')
      expect(response2.body.data.removeRecipeLike).not.toEqual(true)
    })

    test('fails with invalid id', async () => {
      const variables = recipeTestVariables
      const response1 = await request(httpServer)
        .post('/')
        .send({ query: createRecipeQuery, variables })
        .set({ Authorization: token })

      const recipeId = response1.body.data.createRecipe.id as number

      await request(httpServer)
        .post('/')
        .send({ query: likeRecipeQuery, variables: { id: recipeId } })
        .set({ Authorization: token })

      const response2 = await request(httpServer)
        .post('/')
        .send({ query: removeRecipeLikeQuery, variables: { id: recipeId + 1 } })
        .set({ Authorization: token })

      expect(response2.body.errors[0].message).toBe('Like not found')
      expect(response2.body.data.removeRecipeLike).not.toEqual(true)
    })
  })
})
