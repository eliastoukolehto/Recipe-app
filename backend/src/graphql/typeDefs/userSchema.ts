const userTypeDefs = /* GraphQL */`
  type User {
    username: String!
    id: ID!
  }
  type Token {
  value: String!
  }
  extend type Mutation {
    login(
      username: String!
      password: String!
    ): Token
    createUser(
      username: String!
      password: String!
    ): User
    reset: String 
  },
  extend type Query {
    me: User
  }
`

export default userTypeDefs
