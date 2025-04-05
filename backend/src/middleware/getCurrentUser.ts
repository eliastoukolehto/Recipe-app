import { User } from '../models'
import { tokenExtractor } from './tokenExtractor'
import { Request } from 'express'

export const getCurrentUser = async (req: Request | null): Promise<User | null> => {
  const decodedToken = tokenExtractor(req)
  if (!decodedToken) return null
  const currentUser = await User.findByPk(decodedToken.id)
  return currentUser
}
