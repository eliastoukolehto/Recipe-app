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
  migrations: { glob: 'src/migrations/*.ts' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger,
}

export const migrator = new Umzug(migrationConf)

export type Migration = typeof migrator._types.migration

export default {
  connectToDatabase, sequelize,
}
