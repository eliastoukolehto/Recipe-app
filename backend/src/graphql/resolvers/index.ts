import { GraphQLError } from 'graphql'
import { User } from '../../models'
import jwt from 'jsonwebtoken'
import { getEnv } from '../../utils/getenv'
import bcrypt from "bcrypt"

//One capital lietter, lowercase letter and number required
const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{3,30}$/

const resolvers = {
  Query: {
    me: async (_root:unknown, _args:unknown, { currentUser }: {currentUser: object | null}) => { return currentUser },
  },
  Mutation: {
    login: async (_root:unknown, { username, password }: {username: string, password: string}) => {
      const user = await User.findOne({ where: { username: username }})
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)
      if ( !user || !passwordCorrect) {
        throw new GraphQLError('Login failed', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const tokenArgs = {
        username: user.username,
        id: user.id
      }
      const SECRET = getEnv('SECRET')
      const encryptedUser = jwt.sign(tokenArgs, SECRET)
      return { value: encryptedUser }
    },

    createUser: async (_root:unknown, { username, password }: {username: string, password: string}) => {
      if (!passwordRegExp.test(password)) {
        throw new GraphQLError('Creating user failed: Invalid password', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: password
          }
        })
      }
      try {
        const passwordHash = await bcrypt.hash(password, 10) //10 rounds of encryption
        const user = await User.create({
          username: username,
          password: passwordHash,
        })
        return user
      } catch (error) {
        throw new GraphQLError('Creating user failed: Invalid username', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
            error
          }
        })
      }
    }
  }
}

export default resolvers
