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

const GET_TOURNAMENT_BY_ID = gql`
  query GetTournamentsByIds($ids: [ID!]!) {
    getTournamentsByIds(ids: $ids) {
      id
      name
      description
      maxPlayers
      date
      admin {
        id
      }
      ruleset {
        id
        name
      }
      players {
        id
        name
        email
      }
    }
  }
`

const SAVE_TOURNEY = gql`
  mutation CreateTournament($createTourney: CreateTournamentInput!) {
    createTournament(input: $createTourney) {
      id
      name
      ruleset {
        id
        name
      }
      date
      admin {
        id
      }
      invitationOnly
      maxPlayers
    }
  }
`

const DELETE_TOURNEY = gql`
  mutation Mutation($deleteTournamentId: ID!) {
    deleteTournament(id: $deleteTournamentId)
  }
`
const UPDATE_TOURNAMENT_ADD_PLAYER = gql`
  mutation UpdateTournamentAddPlayer($tournamentId: ID!, $playerId: ID!) {
    updateTournamentPlayers(tournamentId: $tournamentId, playerId: $playerId) {
      id
      players {
        id
      }
    }
  }
`
const CREATE_TOURNAMENT = gql`
  mutation CreateTournament($input: CreateTournamentInput!) {
    createTournament(input: $input) {
      name
      ruleset {
        id
        name
      }
      date
      admin {
        id
      }
      invitationOnly
      maxPlayers
    }
  }
`
const UPDATE_TOURNAMENT_MATCHES = gql`
  mutation UpdateTournamentMatches($tournamentId: ID!, $match: MatchInput!) {
    updateTournamentMatches(tournamentId: $tournamentId, match: $match) {
      id
      matches {
        players {
          id
        }
        winner {
          id
        }
        tie
        startTime
        endTime
        totalTime
      }
    }
  }
`

export {
  SEND_INVITATION,
  GET_TOURNAMENT_QUERY,
  GET_TOURNAMENTS_BY_USER,
  GET_TOURNAMENTS_BY_NAME_AND_USER,
  GET_TOURNAMENT_BY_ID,
  SAVE_TOURNEY,
  DELETE_TOURNEY,
  UPDATE_TOURNAMENT_ADD_PLAYER,
  CREATE_TOURNAMENT,
  UPDATE_TOURNAMENT_MATCHES,
}
