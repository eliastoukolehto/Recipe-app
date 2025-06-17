import { User } from '../models'
import { SafeUser } from '../types/userTypes'
import { tokenExtractor } from './tokenExtractor'
import { Request } from 'express'

export const getCurrentUser = async (req: Request | null): Promise<SafeUser | null> => {
  const decodedToken = tokenExtractor(req)
  if (!decodedToken) return null
  const currentUser = await User.findByPk(decodedToken.id)
  if (!currentUser) return null
  return { id: currentUser.id, username: currentUser.username, role: currentUser.role }
}
