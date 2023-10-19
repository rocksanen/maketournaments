import { gql } from '@apollo/client'

export const CREATE_MATCH = gql`
  mutation createMatch($match: MatchInput!) {
    createMatch(match: $match) {
      id
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
`
