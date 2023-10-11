import { Tournament } from '@/models/tournamentModel'
import { Ruleset } from '@/types/Ruleset'
// Assuming you have installed 'graphql-request' package
import { GraphQLClient, gql } from 'graphql-request'
import { test, expect, describe } from '@jest/globals'

require('dotenv').config({ path: `.env.local`, override: true })
const endpoint = (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000') + '/api/graphql/'

const client = new GraphQLClient(endpoint)

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
const UPDATE_TOURNEY = gql`
  mutation UpdateTournament($updateTourney: UpdateTournamentInput!) {
    updateTournament(input: $updateTourney) {
      id
      name
    }
  }
`

const GET_TOURNEY_BY_ID = gql`
  query Query($getTourneyByIdId: ID!) {
    tournament(id: $getTourneyByIdId) {
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

const GET_ALL_TOURNEYS = gql`
  query Query($limit: Int, $offset: Int) {
    allTournaments(limit: $limit, offset: $offset) {
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

const mock_tourney_params = {
  name: 'testturn',
  ruleset: '651ff15e09e79c122e54b3b3',
  admin: [],
  maxPlayers: 24,
  date: '2014-03-12T13:37:27+00:00',
  invitationOnly: true,
}

describe('graphql api: tourneys', () => {
  let createdTourneyId: String

  test('Create tourney', async () => {
    const data = await client.request(SAVE_TOURNEY, {
      createTourney: {
        ...mock_tourney_params,
      },
    })
    expect(data).toEqual({
      createTournament: {
        ...mock_tourney_params,
        ruleset: expect.any(Array),
        id: expect.any(String),
        date: '2014-03-12T13:37:27.000Z',
      },
    })
    createdTourneyId = data.createTournament.id
  })
  test('Get tourney by id', async () => {
    const data = await client.request(GET_TOURNEY_BY_ID, {
      getTourneyByIdId: createdTourneyId,
    })
    expect(data.tournament).toEqual(
      expect.objectContaining({
        name: 'testturn',
        date: '1394631447000',
        id: createdTourneyId,
      }),
    )
  })

  test('Get all tourneys', async () => {
    const data = await client.request(GET_ALL_TOURNEYS, {
      limit: 1000,
      offset: 0,
    })
    expect(data.allTournaments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
        }),
      ]),
    )
  })

  test('Update tourney', async () => {
    const data = await client.request(UPDATE_TOURNEY, {
      updateTourney: {
        id: createdTourneyId,
        name: 'updatedtourn',
      },
    })
  })

  test('Delete tourney', async () => {
    const data = await client.request(DELETE_TOURNEY, {
      deleteTournamentId: createdTourneyId,
    })
    expect(data.deleteTournament).toEqual(true)
  })
})
