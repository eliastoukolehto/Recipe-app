import 'dotenv/config'

export const getEnv = (varName: string): string => {
  const value = process.env[varName]
  if (!value) {
    throw new Error(`Variable ${varName} undefined`)
  }
  return value
}

 