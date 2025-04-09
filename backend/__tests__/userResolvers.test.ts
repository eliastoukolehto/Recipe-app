import { createUserQuery, loginQuery, resetQuery } from './testHelper'
import db from '../src/utils/db'
import request from 'supertest'
import makeServer from '../app'
import { Server } from 'http'

let httpServer: Server

describe('userResolver tests', () => {
  beforeAll(async () => {
    await db.connectToDatabase()
    httpServer = await makeServer()
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  describe('creating user', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
    })

    test('succeeds with correct input', async () => {
      const variables = { username: 'TestUser', password: 'Password1' }
      const response = await request(httpServer)
        .post('/')
        .send({ query: createUserQuery, variables })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.errors).toBeUndefined()
      expect(response.body.data.createUser.username).toBe('TestUser')
    })

    test('fails with username too short', async () => {
      const variables = { username: 'hi', password: 'Password1' }
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('hi')
    })

    test('fails with username too long', async () => {
      const variables = { username: 'verylongusername', password: 'Password1' }
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('verylongusername')
    })

    test('fails with username with space', async () => {
      const variables = { username: 'user name', password: 'Password1' }
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('user name')
    })

    test('fails with taken username', async () => {
      const variables = { username: 'TestUser', password: 'Password1' }
      await request(httpServer).post('/').send({ query: createUserQuery, variables })
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('TestUser')
    })

    test('fails with password too short', async () => {
      const variables = { username: 'TestUser', password: 'Pw1' }
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('Pw1')
    })

    test('fails with password without upprcase letters', async () => {
      const variables = { username: 'TestUser', password: 'password1' }
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('password1')
    })

    test('fails with password without lowercase letters', async () => {
      const variables = { username: 'TestUser', password: 'PASSWORD1' }
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('PASSWORD1')
    })

    test('fails with password without numbers', async () => {
      const variables = { username: 'TestUser', password: 'InvalidPassword' }
      const response = await request(httpServer).post('/').send({ query: createUserQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.invalidArgs).toBe('InvalidPassword')
    })
  })

  describe('login query', () => {
    beforeEach(async () => {
      await request(httpServer).post('/').send({ query: resetQuery })
    })

    test('succeeds with correct credentials', async () => {
      const variables = { username: 'TestUser', password: 'Password1' }
      await request(httpServer).post('/').send({ query: createUserQuery, variables })
      const response = await request(httpServer).post('/').send({ query: loginQuery, variables })

      expect(response.body.errors).toBeUndefined()
      expect(response.body.data.login.value).toBeDefined()
    })

    test('fails with incorrect credentials', async () => {
      const variables1 = { username: 'TestUser', password: 'Password1' }
      const variables2 = { username: 'TestUser', password: 'wrongPassword' }
      await request(httpServer).post('/').send({ query: createUserQuery, variables1 })
      const response = await request(httpServer).post('/').send({ query: loginQuery, variables2 })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })

    test('fails with missing user', async () => {
      const variables = { username: 'nonUser', password: 'Password1' }
      const response = await request(httpServer).post('/').send({ query: loginQuery, variables })

      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].extensions.code).toBe('BAD_USER_INPUT')
    })
  })
})
