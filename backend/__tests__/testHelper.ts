import { ApolloServer } from "@apollo/server";
import resolvers from "../src/graphql/resolvers";
import typeDefs from "../src/graphql/schemas";
import { migrator } from "../src/utils/db";

export const createTestServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers
  })
}


export const resetDatabase = async () => {
  await migrator.down({to: 0})
  await migrator.up()
}