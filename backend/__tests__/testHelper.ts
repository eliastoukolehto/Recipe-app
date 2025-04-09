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
