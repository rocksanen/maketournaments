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
const GET_RULES = gql`
  query allTournaments($limit: Int, $offset: Int) {
    allRulesets(limit: $limit, offset: $offset) {
      id
      name
      rounds
      winnerpoints
      loserpoints
      drawpoints
      nightmarepoints
      nightmarePointsOn
    }
  }
`
const SAVE_RULESET = gql`
  mutation createRuleset($ruleset: RulesetInput!) {
    createRuleset(input: $ruleset) {
      name
      rounds
      winnerpoints
      loserpoints
      drawpoints
      nightmarepoints
      nightmarePointsOn
      id
    }
  }
`
const DELETE_RULESET = gql`
  mutation deleteRuleset($id: ID!) {
    deleteRuleset(id: $id)
  }
`

export { GET_RULESET_BY_ID, GET_RULES, SAVE_RULESET, DELETE_RULESET }
