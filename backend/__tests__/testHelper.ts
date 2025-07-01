import request from 'supertest'
import { Server } from 'http'
import { getEnv } from '../src/utils/config'
import makeServer from '../app'

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

export const existingCustomUserToken = async (httpServer: Server, username: string, password: string) => {
  const variables = { username, password }
  await request(httpServer).post('/').send({ query: createUserQuery, variables })
  const response = await request(httpServer).post('/').send({ query: loginQuery, variables })
  const token = response.body.data.login?.value
  if (!token) {
    console.log('error with creating token:', JSON.stringify(response.body))
  }
  return `Bearer ${token}`
}

export const superuserToken = async (httpServer: Server) => {
  const variables = { username: getEnv('ADMIN_USERNAME'), password: getEnv('ADMIN_PASSWORD') }
  const response = await request(httpServer).post('/').send({ query: loginQuery, variables })
  const token = response.body.data.login?.value
  if (!token) {
    console.log('error fetching superuser token:', JSON.stringify(response.body))
  }
  return `Bearer ${token}`
}

export const testServer = makeServer()
