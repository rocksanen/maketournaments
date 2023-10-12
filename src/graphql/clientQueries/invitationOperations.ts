import { gql } from '@apollo/client'

const SEND_INVITATION = gql`
  mutation SendInvitation($tournamentId: ID!, $email: String!) {
    sendInvitation(tournamentId: $tournamentId, email: $email) {
      success
      message
    }
  }
`
export { SEND_INVITATION }
