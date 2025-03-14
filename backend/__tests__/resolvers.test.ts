import { resetDatabase, createTestServer } from "./testHelper"
import assert from 'assert'
import db from "../src/utils/db"

const testServer = createTestServer()

const loginQuery = /* GraphQL */`
mutation login($username: String!, $password: String!) {
  login(
    username: $username
    password: $password
  ) {
    value
  }
}
`
const createUserQuery = /* GraphQL */`
mutation createUser($username: String!, $password: String!) {
  createUser(
    username: $username
    password: $password
  ) {
    username
    id
  }
}
`

describe('resolver tests', () => {

  afterAll(async () => {
    await testServer.stop()
    await db.sequelize.close()
  })

  describe('creating user', () => {

    beforeEach(async () => {
      await resetDatabase()
    })

    test('succeeds with correct input', async () => {
      const variables = { username: "TestUser", password: "Password1" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeUndefined()
      const data = JSON.parse(JSON.stringify(response.body.singleResult.data))
      expect(data.createUser.username).toBe("TestUser")
    })

    test('fails with username too short', async () => {
      const variables = { username: "hi", password: "Password1" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("hi")
    })

    test('fails with username too long', async () => {
      const variables = { username: "verylongusername", password: "Password1" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("verylongusername")
    })

    test('fails with username with space', async () => {
      const variables = { username: "user name", password: "Password1" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("user name")
    })

    test('fails with taken username', async () => {
      const variables = { username: "TestUser", password: "Password1" }
      await testServer.executeOperation({query: createUserQuery, variables})
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("TestUser")
    })

    test('fails with password too short', async () => {
      const variables = { username: "TestUser", password: "Pw1" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("Pw1")
    })

    test('fails with password without upprcase letters', async () => {
      const variables = { username: "TestUser", password: "password1" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("password1")
    })
  
    test('fails with password without lowercase letters', async () => {
      const variables = { username: "TestUser", password: "PASSWORD1" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("PASSWORD1")
    })

    test('fails with password without numbers', async () => {
      const variables = { username: "TestUser", password: "InvalidPassword" }
      const response = await testServer.executeOperation({query: createUserQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.invalidArgs).toBe("InvalidPassword")
    })
  })

  
  describe('login query', () => {
  
    beforeEach(async () => {
      await resetDatabase()
    })
  
    test('succeeds with correct credentials', async () => {
  
      const variables = { username: "TestUser", password: "Password1" }
      await testServer.executeOperation({query: createUserQuery, variables})
      const response = await testServer.executeOperation({query: loginQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeUndefined()
      const data = JSON.parse(JSON.stringify(response.body.singleResult.data))
      expect(data.login.value).toBeDefined()
    })
  
    test('fails with incorrect credentials', async () => {
  
      const variables1 = { username: "TestUser", password: "Password1" }
      const variables2 = { username: "TestUser", password: "wrongPassword" }
      await testServer.executeOperation({query: createUserQuery, variables: variables1})
      const response = await testServer.executeOperation({query: loginQuery, variables: variables2})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.code).toBe("BAD_USER_INPUT")
    })
  
    test('fails with missing user', async () => {
  
      const variables = { username: "nonUser", password: "Password1" }
      const response = await testServer.executeOperation({query: loginQuery, variables})

      assert(response.body.kind === 'single')
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0]?.extensions?.code).toBe("BAD_USER_INPUT")
    })
  })

})

