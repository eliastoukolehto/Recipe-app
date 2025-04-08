import { Recipe, User } from '../../models'
import { getEnv } from '../../utils/config'

export const resetResolver = {
  Mutation: {
    reset: async (_root: unknown, _args: unknown) => {
      const enabled = getEnv('NODE_ENV') === 'test'
      if (!enabled) {
        return 'Reset mutation disabled!'
      }
      else {
        await User.truncate()
        await Recipe.truncate()
        return 'Database has been reset!'
      }
    },
  },
}
