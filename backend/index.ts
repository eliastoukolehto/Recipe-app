import db from './src/utils/db'
import { getEnv } from './src/utils/config'
import makeServer from './app'

const PORT = getEnv('PORT')
const start = async () => {
  await db.connectToDatabase()
  const httpServer = await makeServer()

  httpServer.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`),
  )
}

start()
