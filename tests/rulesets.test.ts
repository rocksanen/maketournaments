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
const UPDATE_RULESET = gql`
  mutation createRuleset($updateRuleset: UpdateRulesetInput!) {
    updateRuleset(input: $updateRuleset) {
      name
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
const GET_ALL_RULSESETS = gql`
  query Query($limit: Int, $offset: Int) {
    allRulesets(limit: $limit, offset: $offset) {
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
  mutation Mutation($deleteRulesetId: ID!) {
    deleteRuleset(id: $deleteRulesetId)
  }
`

const mock_ruleset_params = {
  name: 'jesttestruleset',
  rounds: 3,
  winnerpoints: 3,
  loserpoints: 0,
  drawpoints: 1,
  nightmarepoints: 0,
  nightmarePointsOn: false,
}

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

  test('Get all rulesets', async () => {
    const data = await client.request(GET_ALL_RULSESETS, {
      limit: 1000,
      offset: 0,
    })
    expect(data.allRulesets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdRulesetId,
        }),
      ]),
    )
  })

  test('Update ruleset', async () => {
    const data = await client.request(UPDATE_RULESET, {
      updateRuleset: {
        id: createdRulesetId,
        name: 'updatedruleset',
      },
    })
    expect(data.updateRuleset).toEqual({
      id: createdRulesetId,
      name: 'updatedruleset',
    })
  })

  test('Delete ruleset', async () => {
    const data = await client.request(DELETE_RULESET, {
      deleteRulesetId: createdRulesetId,
    })
    expect(data.deleteRuleset).toEqual(true)
  })
})
