import { ApolloServer } from "@apollo/server";
import resolvers from "../src/graphql/resolvers";
import typeDefs from "../src/graphql/schemas";

export const createTestServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers
  })
}