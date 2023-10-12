// get ruleset by id
import { gql } from '@apollo/client'

const GET_RULESET_BY_ID = gql`
  query GetRulesetById($id: ID!) {
    ruleset(id: $id) {
      id
      rounds
      winnerpoints
      loserpoints
      drawpoints
      nightmarepoints
      nightmarePointsOn
      name
    }
  }
`

export { GET_RULESET_BY_ID }
