import 'dotenv/config'

export const getEnv = (varName: string): string => {
  const value = process.env[varName]
  if (!value) {
    throw new Error(`Variable ${varName} undefined`)
  }
  return value
}
  

export const DATABASE_URL = process.env.NODE_ENV === 'test' 
  ? getEnv("DATABASE_URL")
  : getEnv("TEST_DATABASE_URL")



