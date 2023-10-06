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

const DELETE_RULESET = gql`
  mutation deleteRuleset($id: String!) {
    deleteRuleset(id: $id) {
      id
    }
  }
`

describe('graphql api: rulesets', () => {
  let createdRulesetId: String

  test('Create ruleset', async () => {
    const data = await client.request(SAVE_RULESET, {
      ruleset: {
        name: 'test',
        rounds: 3,
        winnerpoints: 3,
        loserpoints: 0,
        drawpoints: 1,
        nightmarepoints: 0,
        nightmarePointsOn: false,
      },
    })
    expect(data).toEqual({
      createRuleset: {
        name: 'test',
        rounds: 3,
        winnerpoints: 3,
        loserpoints: 0,
        drawpoints: 1,
        nightmarepoints: 0,
        nightmarePointsOn: false,
        id: expect.any(String),
      },
    })
    createdRulesetId = data.createRuleset.id
  })
  test('Delete ruleset', async () => {
    console.log('createdrulesetid', createdRulesetId)
    const data = await client.request(DELETE_RULESET, {
      id: 'test',
    })
    expect(data).toEqual({
      deleteRuleset: {
        id: createdRulesetId,
      },
    })
  })
})
