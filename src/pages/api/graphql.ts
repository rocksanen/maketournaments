import { user } from '@nextui-org/react'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'

import typeDefs from '@/graphql/schemas/index'
import resolvers from '@/graphql/resolvers/index'
import { connectToDatabase } from '@/utils/db'
import { Session } from '@/types/next-auth'
import { getSession } from 'next-auth/react'

connectToDatabase()

const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
})

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => {
    const session = await getSession({ req })
    return { req, res, session: session as Session }
  },
})
export default handler
