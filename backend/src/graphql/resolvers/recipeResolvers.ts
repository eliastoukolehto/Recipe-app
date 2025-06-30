import { GraphQLError } from 'graphql'
import { Recipe, RecipeLike, User } from '../../models/index'
import { toNewRecipe } from '../../utils/recipeValidators'
import { SafeUser } from '../../types/userTypes'
import { Includeable, Op } from 'sequelize'
import { ParsedRecipe, QueriedRecipe } from '../../types/recipeTypes'

// if user is logged in, include which recipes have been liked
const parseInclude = (user: SafeUser | null) => {
  const initialInclude = [{ model: User, attributes: ['id', 'username', 'role'] }] as Includeable[]
  if (!user) return initialInclude
  const ifUserInclude = {
    model: User,
    as: 'likedBy',
    attributes: ['id'],
    required: false,
    where: {
      id: user.id,
    },
  } as Includeable
  return [...initialInclude, ifUserInclude]
}

export const recipeResolvers = {
  Query: {
    recipes: async (_root: unknown, { page, search }: { page: number, search: string }, { currentUser }: { currentUser: Promise<SafeUser | null> }) => {
      const limit = 12
      const offset = page * limit
      const user = await currentUser

      const parseFilter = (search: string) => {
        if (search) {
          return { name: {
            [Op.iLike]: `%${search.trim()}%`,
          },
          }
        }
        return {}
      }

      const filter = parseFilter(search)
      const include = parseInclude(user)

      const result = await Recipe.findAndCountAll({
        include: include,
        limit: limit,
        offset: offset,
        where: filter,
      })

      // Convert likedByCurrentUser to boolean
      const recipes = result.rows.map((recipe) => {
        const plainRecipe = recipe.get({ plain: true }) as unknown as QueriedRecipe
        const likedByCurrentUser = plainRecipe.likedBy != undefined && plainRecipe.likedBy.length > 0

        return { ...plainRecipe, likedByCurrentUser, likedBy: undefined }
      }) as ParsedRecipe[]

      return { count: result.count, rows: recipes }
    },
    recipe: async (_root: unknown, { id }: { id: number }, { currentUser }: { currentUser: Promise<SafeUser | null> }) => {
      const user = await currentUser
      const include = parseInclude(user)
      const result = await Recipe.findByPk(id, { include: include, plain: true })

      if (!result) {
        throw new GraphQLError('Recipe not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      // Convert likedByCurrentUser to boolean
      const plainResult = result.get({ plain: true }) as unknown as QueriedRecipe
      const recipe: ParsedRecipe = {
        ...plainResult,
        likedByCurrentUser: plainResult.likedBy != undefined && plainResult.likedBy.length > 0,
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
    likeRecipe: async (_root: unknown, { id }: { id: number }, { currentUser }: { currentUser: Promise<SafeUser | null> }) => {
      const user = await currentUser

      // Check if recipe is valid to like
      const recipe = await Recipe.findByPk(id)
      if (!recipe || !user) {
        throw new GraphQLError('Liking recipe failed', { extensions: {
          code: 'BAD_USER_INPUT',
        } })
      }
      try {
        const addedLike = await RecipeLike.create({ recipeId: id, userId: user.id })
        return addedLike
      }
      catch (error) {
        throw new GraphQLError('Liking recipe failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    removeRecipeLike: async (_root: unknown, { id }: { id: number }, { currentUser }: { currentUser: Promise<SafeUser | null> }) => {
      const user = await currentUser
      if (!user) {
        throw new GraphQLError('Removing like failed', { extensions: {
          code: 'BAD_USER_INPUT',
        } })
      }

      // check if like exists
      const like = await RecipeLike.findOne({ where: { userId: user.id, recipeId: id } })
      if (!like) {
        throw new GraphQLError('Like not found', { extensions: {
          code: 'BAD_USER_INPUT',
        } })
      }
      try {
        like.destroy()
        return true
      }
      catch (error) {
        throw new GraphQLError('Removing like failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
  },
}
