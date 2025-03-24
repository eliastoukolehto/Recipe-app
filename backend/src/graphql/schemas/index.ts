const typeDefs = /* GraphQL */`
  type User {
    username: String!
    id: ID!
  }
  type Token {
  value: String!
  }
  type Mutation {
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
  type Query {
    me: User
  }
`

export default typeDefs