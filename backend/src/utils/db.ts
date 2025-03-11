import { Sequelize } from "sequelize"
import { getEnv } from "./getenv"
  
const DATABASE_URL = getEnv('DATABASE_URL')
const sequelize = new Sequelize(DATABASE_URL)


const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch {
    console.log('database connection failed')
    return process.exit(1)
  }
  return null
}


export default {
  connectToDatabase, sequelize
}