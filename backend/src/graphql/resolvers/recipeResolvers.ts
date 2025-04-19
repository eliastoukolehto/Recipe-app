import { GraphQLError } from 'graphql'
import { Recipe, User } from '../../models'
import { toNewRecipe } from '../../utils/recipeValidators'
import { SafeUser } from '../../types/userTypes'

export const recipeResolvers = {
  Query: {
    recipes: async (_root: unknown, { page }: { page: number }) => {
      const limit = 12
      const offset = page * limit

      const recipes = await Recipe.findAndCountAll({
        include: { model: User },
        limit: limit,
        offset: offset,
      })
      return recipes
    },
    recipe: async (_root: unknown, { id }: { id: number }) => {
      const recipe = await Recipe.findByPk(id, { include: { model: User } })
      if (!recipe) {
        throw new GraphQLError('Recipe not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      return recipe
    },
  },
  Mutation: {
    createRecipe: async (_root: unknown, args: unknown, { currentUser }: { currentUser: Promise<SafeUser | null> }) => {
      const user = await currentUser
      if (user === null) {
        throw new GraphQLError('Unauthorized', { extensions: {
          code: 'BAD_USER_INPUT',
        } })
      }
      try {
        const newRecipe = toNewRecipe(args)
        const addedRecipe = await Recipe.create({ ...newRecipe, userId: user.id })
        await addedRecipe.reload({ include: { model: User } })
        return addedRecipe
      }
      catch (error) {
        throw new GraphQLError('Creating recipe failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
  },
}
