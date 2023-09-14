import { gql } from 'graphql-tag'

  // change User -> [User] to return an array of users
export const typeDefs = gql`
  type Query {
    hello: String
    user: User
  }
  type User {
    _id: ID
    name: String
    email: String
    password: String
  }
`
