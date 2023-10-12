import { gql } from '@apollo/client'

const GET_USER_INVITATIONS_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      invitations
      name
    }
  }
`

const GET_ADMINS_BY_ID = gql`
  query GetUsersByIds($ids: [ID!]!) {
    getUsersByIds(ids: $ids) {
      id
      name
    }
  }
`
const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      email
      id
      name
    }
  }
`

export { GET_USER_INVITATIONS_BY_ID, GET_ADMINS_BY_ID, GET_USER_BY_EMAIL }
