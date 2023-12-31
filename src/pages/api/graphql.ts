import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'

import resolvers from '@/graphql/resolvers/index'
import typeDefs from '@/graphql/schemas/index'
import { connectToDatabase } from '@/utils/db'

connectToDatabase()

const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
})

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({ req, res }),
})
export default handler
