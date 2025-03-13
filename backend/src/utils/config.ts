import 'dotenv/config'

//export const DATABASE_URL = process.env.DATABASE_URL
export const getDatabaseUrl = (): string => {
  if (process.env.NODE_ENV === 'test') {
    if (!process.env.TEST_DATABASE_URL) {
      throw new Error(`Variable TEST_DATABASE_URL undefined`)
    }
    else {
      return process.env.TEST_DATABASE_URL
    }
  }
  else {
    if (!process.env.DATABASE_URL) {
      throw new Error(`Variable DATABASE_URL undefined`)
    }
    else {
      return process.env.DATABASE_URL
    }
  }
}
export const PORT = 4000

