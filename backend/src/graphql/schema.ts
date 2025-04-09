import { resetResolver } from './resolvers/resetResolver'
import { recipeResolvers } from './resolvers/recipeResolvers'
import { userResolvers } from './resolvers/userResolvers'
import recipeTypeDefs from './typeDefs/recipeSchema'
import userTypeDefs from './typeDefs/userSchema'

const rootTypeDefs = /* GraphQL */`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`

export const typeDefs = [
  rootTypeDefs,
  userTypeDefs,
  recipeTypeDefs,
]

export const resolvers = [
  resetResolver,
  userResolvers,
  recipeResolvers,
]
