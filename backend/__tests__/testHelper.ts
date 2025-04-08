import { ApolloServer } from '@apollo/server'
import resolvers from '../src/graphql/resolvers/resetResolver'
import typeDefs from '../src/graphql/typeDefs/userSchema'

export const createTestServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
  })
}
