import { Sequelize } from 'sequelize'
import { DATABASE_URL, getEnv } from './config'
import { SequelizeStorage, Umzug } from 'umzug'

// Remove logging during tests
const logging = getEnv('NODE_ENV') === 'test'
  ? false
  : console.log
const logger = getEnv('NODE_ENV') === 'test'
  ? undefined
  : console

// migration files are in different location after compiling
const migrationsPath = getEnv('NODE_ENV') === 'production'
  ? 'build/src/migrations/*.js'
  : 'src/migrations/*.ts'

const sequelize = new Sequelize(DATABASE_URL, { logging })

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await migrator.up()
    console.log('connected to the database')
  }
  catch (e) {
    console.log(e)
    console.log('database connection failed')
    return process.exit(1)
  }
  return null
}

const migrationConf = {
  migrations: { glob: migrationsPath },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger,
}

export const migrator = new Umzug(migrationConf)

export type Migration = typeof migrator._types.migration

export default {
  connectToDatabase, sequelize,
}
