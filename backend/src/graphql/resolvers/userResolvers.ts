import { GraphQLError } from 'graphql'
import { User } from '../../models'
import jwt from 'jsonwebtoken'
import { getEnv } from '../../utils/config'
import bcrypt from 'bcrypt'
import { SafeUser } from '../../types/userTypes'

// One capital letter, lowercase letter and number required, at least 8 letters
const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,30}$/

export const userResolvers = {
  Query: {
    me: async (_root: unknown, _args: unknown, { currentUser }: { currentUser: SafeUser | null }) => { return currentUser },
  },
  Mutation: {
    login: async (_root: unknown, { username, password }: { username: string, password: string }) => {
      const user = await User.findOne({ where: { username: username } })
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)
      if (!user || !passwordCorrect) {
        throw new GraphQLError('Login failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const tokenArgs = {
        username: user.username,
        id: user.id,
        role: user.role,
      }
      const SECRET = getEnv('SECRET')
      const encryptedUser = jwt.sign(tokenArgs, SECRET)
      return { value: encryptedUser }
    },

    createUser: async (_root: unknown, { username, password }: { username: string, password: string }) => {
      if (!passwordRegExp.test(password)) {
        throw new GraphQLError('Creating user failed: Invalid password', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: password,
          },
        })
      }
      try {
        const passwordHash = await bcrypt.hash(password, 10) // 10 rounds of encryption
        const user = await User.create({
          username: username,
          password: passwordHash,
          role: 0,
        })
        return user
      }
      catch (error) {
        throw new GraphQLError('Creating user failed: Invalid username', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
            error,
          },
        })
      }
    },
  },
}
