import { GraphQLError } from 'graphql'
import { Recipe, RecipeLike, User } from '../../models'
import { toNewRecipe } from '../../utils/recipeValidators'
import { SafeUser } from '../../types/userTypes'
import { Includeable, Op } from 'sequelize'

export const recipeResolvers = {
  Query: {
    recipes: async (_root: unknown, { page, search, currentUser }: { page: number, search: string, currentUser: SafeUser | null }) => {
      const limit = 12
      const offset = page * limit

      const parseFilter = (search: string) => {
        if (search) {
          return { name: {
            [Op.iLike]: `%${search.trim()}%`,
          },
          }
        }
        return {}
      }

      // if currentUser exists, include which recipes user has liked
      const parseInclude = (currentUser: SafeUser | null) => {
        const include = [{ model: User }] as Includeable[]
        if (currentUser) {
          include.concat([{
            model: RecipeLike,
            as: 'likedByCurrentUser',
            attributes: ['userId'],
            required: false,
            where: {
              user_id: currentUser.id,
            },
          }])
        }
        return include
      }

      const filter = parseFilter(search)
      const include = parseInclude(currentUser)

      const result = await Recipe.findAndCountAll({
        include: include,
        limit: limit,
        offset: offset,
        where: filter,
        raw: true,
      })

      // Convert likedByCurrentUser to boolean
      const recipes = result.rows.map((recipe) => {
        const likedByCurrentUser = recipe.likedByCurrentUser != undefined

        return { ...recipe, likedByCurrentUser: likedByCurrentUser }
      })

      return { count: result.count, rows: recipes }
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
    deleteRecipe: async (_root: unknown, { id }: { id: number }, { currentUser }: { currentUser: Promise<SafeUser | null> }) => {
      const user = await currentUser
      const recipe = await Recipe.findByPk(id, { include: { model: User } })
      if (!recipe || (user?.id != recipe.userId && user?.role != 1)) {
        throw new GraphQLError('Unauthorized', { extensions: {
          code: 'BAD_USER_INPUT',
        } })
      }
      try {
        recipe.destroy()
        return true
      }
      catch (error) {
        throw new GraphQLError('Deleting recipe failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
  },
}
