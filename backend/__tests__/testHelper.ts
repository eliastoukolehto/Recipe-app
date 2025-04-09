import request from 'supertest'
import { Server } from 'http'

export const createUserQuery = /* GraphQL */`
  mutation createUser(
    $username: String!
    $password: String!
  ) {
    createUser(
      username: $username
      password: $password
    ) {
      id
      username
    }
  }
`

export const loginQuery = /* GraphQL */`
mutation login($username: String!, $password: String!) {
  login(
    username: $username
    password: $password
  ) {
    value
  }
}
`

export const resetQuery = /* GraphQL */`
mutation {
  reset
}
`

export const existingUserToken = async (httpServer: Server) => {
  const variables = { username: 'TestUser', password: 'Password1' }
  await request(httpServer).post('/').send({ query: createUserQuery, variables })
  const response = await request(httpServer).post('/').send({ query: loginQuery, variables })
  const token = response.body.data.login?.value
  if (!token) {
    console.log('error with creating token:', JSON.stringify(response.body))
  }
  return `Bearer ${token}`
}
