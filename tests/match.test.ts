import { invited_placeholder } from './../src/components/invitePlayers/invitationdata'
// Assuming you have installed 'graphql-request' package
import { GraphQLClient, gql } from 'graphql-request'
import { test, expect, describe } from '@jest/globals'

require('dotenv').config({ path: `.env.local`, override: true })
const endpoint = (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000') + '/api/graphql/'

const client = new GraphQLClient(endpoint)

const CREATE_MATCH = gql`
  mutation createMatch($match: CreateMatchInput!) {
    createMatch(input: $match) {
      id
      startTime
      endTime
    }
  }
`
const UPDATE_MATCH = gql`
  mutation createMatch($updateMatch: UpdateMatchInput!) {
    updateMatch(input: $updateMatch) {
      id
      startTime
      endTime
    }
  }
`

const GET_MATCH_BY_ID = gql`
  query Query($getMatchById: ID!) {
    match(id: $getMatchById) {
      id
      startTime
      endTime
    }
  }
`
const GET_ALL_MATCHES = gql`
  query Query($limit: Int, $offset: Int) {
    allMatches(limit: $limit, offset: $offset) {
      id
      startTime
      endTime
    }
  }
`

const DELETE_MATCH = gql`
  mutation Mutation($deleteMatchId: ID!) {
    deleteMatch(id: $deleteMatchId)
  }
`

const mock_match_params = {
  startTime: '2023-06-09',
  endTime: '2025-10-11',
}

describe('graphql api: matches', () => {
  let createdMatchId: String

  test('Create match', async () => {
    const data = await client.request(CREATE_MATCH, {
      match: {
        ...mock_match_params,
      },
    })
    createdMatchId = data.createMatch.id
    expect(data).toEqual({
      createMatch: {
        ...mock_match_params,
        startTime: '1686268800000',
        endTime: '1760140800000',
        id: expect.any(String),
      },
    })
  })
  test('Get match by id', async () => {
    const data = await client.request(GET_MATCH_BY_ID, {
      getMatchById: createdMatchId,
    })
    expect(data.match).toEqual({
      ...mock_match_params,
      startTime: '1686268800000',
      endTime: '1760140800000',
      id: createdMatchId,
    })
  })

  test('Get all matches', async () => {
    const data = await client.request(GET_ALL_MATCHES, {
      limit: 1000,
      offset: 0,
    })
    expect(data.allMatches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdMatchId,
        }),
      ]),
    )
  })

  test('Update match', async () => {
    const data = await client.request(UPDATE_MATCH, {
      updateMatch: {
        endTime: '2045-12-31',
        id: createdMatchId,
      },
    })
    console.log(data)
    expect(data.updateMatch).toEqual({
      id: createdMatchId,
      startTime: '1686268800000',
      endTime: '2398291200000',
    })
  })

  //   test('Delete match', async () => {
  //     const data = await client.request(DELETE_MATCH, {
  //       deleteMatchId: createdMatchId,
  //     })
  //     expect(data.deleteMatch).toEqual(true)
  //   })
})
