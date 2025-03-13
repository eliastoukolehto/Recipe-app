import { Sequelize } from "sequelize"
import { getDatabaseUrl } from "./config"

const DATABASE_URL = getDatabaseUrl()
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