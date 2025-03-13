import { Sequelize } from "sequelize"
import { DATABASE_URL } from "./config"
import { SequelizeStorage, Umzug } from "umzug"

const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await migrator.up()
    console.log('connected to the database')
  } catch {
    console.log('database connection failed')
    return process.exit(1)
  }
  return null
}

const migrationConf = {
  migrations: { glob: 'src/migrations/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
}

export const migrator = new Umzug(migrationConf)

export type Migration = typeof migrator._types.migration

export default {
  connectToDatabase, sequelize
}