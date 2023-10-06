// Assuming you have installed 'graphql-request' package
import { GraphQLClient, gql } from 'graphql-request'
import { test, expect, describe } from '@jest/globals'

require('dotenv').config({ path: `.env.local`, override: true })
const endpoint = (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000') + '/api/graphql/'

const client = new GraphQLClient(endpoint)

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
const GET_RULESET_BY_ID = gql`
  query Query($getRulesetByIdId: ID!) {
    ruleset(id: $getRulesetByIdId) {
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

const mock_ruleset_params = {
  name: 'jesttest',
  rounds: 3,
  winnerpoints: 3,
  loserpoints: 0,
  drawpoints: 1,
  nightmarepoints: 0,
  nightmarePointsOn: false,
}
const DELETE_RULESET = gql`
  mutation Mutation($deleteRulesetId: ID!) {
    deleteRuleset(id: $deleteRulesetId)
  }
`

describe('graphql api: rulesets', () => {
  let createdRulesetId: String

  test('Create ruleset', async () => {
    const data = await client.request(SAVE_RULESET, {
      ruleset: {
        ...mock_ruleset_params,
      },
    })
    expect(data).toEqual({
      createRuleset: {
        ...mock_ruleset_params,
        id: expect.any(String),
      },
    })
    createdRulesetId = data.createRuleset.id
  })
  test('Get ruleset by id', async () => {
    const data = await client.request(GET_RULESET_BY_ID, {
      getRulesetByIdId: createdRulesetId,
    })
    expect(data.ruleset).toEqual({
      ...mock_ruleset_params,
      id: createdRulesetId,
    })
  })

  test('Delete ruleset', async () => {
    const data = await client.request(DELETE_RULESET, {
      deleteRulesetId: createdRulesetId,
    })
    expect(data.deleteRuleset).toEqual(true)
  })
})
