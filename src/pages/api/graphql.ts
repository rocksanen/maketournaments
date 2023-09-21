import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'

import typeDefs from '@/graphql/schemas/index'
import resolvers from '@/graphql/resolvers/index'
import { connectToDatabase } from '@/utils/db'


// const resolvers = {
//   Query: {
//     hello: () => 'world',
//   },
// }

// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `
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

// export default startServerAndCreateNextHandler(server, {
//     context: async (req, res) => ({ req, res, user: await getLoggedInUser(req) }),
//   });