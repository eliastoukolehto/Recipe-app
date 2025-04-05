import { Request } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getEnv } from '../utils/config'

export const tokenExtractor = (req: Request | null): JwtPayload | null => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.startsWith('Bearer ')) {
    const SECRET = getEnv('SECRET')
    const decodedToken = jwt.verify(auth.substring(7), SECRET)
    if (typeof decodedToken !== 'string') return decodedToken
  }
  return null
}
