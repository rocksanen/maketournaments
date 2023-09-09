import { gql } from 'graphql-tag'

export const typeDefs = gql`
  type Query {
    hello: String
    user: [User]
  }
  type User {
    id: ID
    name: String
    email: String
    password: String
  }
`
