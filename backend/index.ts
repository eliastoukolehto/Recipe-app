import { ApolloServer } from '@apollo/server'
import db from './src/utils/db'
import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers, typeDefs } from './src/graphql/schema'
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import { expressMiddleware } from '@apollo/server/express4'
import { getCurrentUser } from './src/middleware/getCurrentUser'
import { getEnv } from './src/utils/config'

const start = async () => {
  await db.connectToDatabase()
  const app = express()
  const httpServer = http.createServer(app)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ currentUser: getCurrentUser(req) }),
    }),
  )
  const PORT = getEnv('PORT')
  httpServer.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`),
  )
}

start()
