import db from '../../src/utils/db'

beforeAll(async () => {
  await db.connectToDatabase()
})

afterAll(async () => {
  await db.sequelize.close()
})
