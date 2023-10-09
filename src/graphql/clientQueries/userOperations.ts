import { gql } from '@apollo/client'

const GET_USER_INVITATIONS_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      invitations
    }
  }
`

export { GET_USER_INVITATIONS_BY_ID }
