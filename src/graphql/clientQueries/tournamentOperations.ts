import { gql } from '@apollo/client'

const SEND_INVITATION = gql`
  mutation SendInvitation($tournamentId: ID!, $email: String!) {
    sendInvitation(tournamentId: $tournamentId, email: $email) {
      success
      message
    }
  }
`

const GET_TOURNAMENT_QUERY = gql`
  query GetTournamentByName($name: String!) {
    tournamentByName(name: $name) {
      id
      name
    }
  }
`

const GET_TOURNAMENTS_BY_USER = gql`
  query GetTournamentsByUser($userId: ID!) {
    tournamentsByUser(userId: $userId) {
      admin {
        id
      }
      players {
        id
      }
      name
      date
      id
    }
  }
`

const GET_TOURNAMENTS_BY_NAME_AND_USER = gql`
  query GetTournamentsByNameAndUser($name: String!, $userId: ID!) {
    tournamentsByNameAndUser(name: $name, userId: $userId) {
      admin {
        id
      }
      players {
        id
      }
      id
      name
    }
  }
`

export {
  SEND_INVITATION,
  GET_TOURNAMENT_QUERY,
  GET_TOURNAMENTS_BY_USER,
  GET_TOURNAMENTS_BY_NAME_AND_USER,
}
