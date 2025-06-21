import { Recipe, User } from '../../models'
import { getEnv } from '../../utils/config'
import bcrypt from 'bcrypt'

export const resetResolver = {
  Mutation: {
    reset: async (_root: unknown, _args: unknown) => {
      const enabled = getEnv('NODE_ENV') === 'test'
      if (!enabled) {
        return 'Reset mutation disabled!'
      }
      else {
        await User.truncate({ cascade: true })
        await Recipe.truncate({ cascade: true })

        const passwordHash = await bcrypt.hash(getEnv('ADMIN_PASSWORD'), 10)
        await User.create({ username: getEnv('ADMIN_USERNAME'), password: passwordHash, role: 1 })

        return 'Database has been reset!'
      }
    },
  },
}
