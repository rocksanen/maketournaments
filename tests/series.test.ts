import { GraphQLClient, gql } from 'graphql-request'
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

require('dotenv').config({ path: `.env.local`, override: true })
const endpoint = (process.env.NEXT_PUBLIC_URL || 'http://localhost:3000') + '/api/graphql/'

const client = new GraphQLClient(endpoint)

import {
  CREATE_SERIES,
  DELETE_SERIES,
  FETCH_SERIES,
  UPDATE_SERIES_NAME,
  ADD_TO_TOURNAMENT,
  DELETE_TOURNAMENT_FROM_SERIES,
  GET_TOURNAMENTS_BY_SERIES,
} from '@/graphql/clientQueries/seriesOperations'

import { SAVE_TOURNEY, DELETE_TOURNEY } from '@/graphql/clientQueries/tournamentOperations'

const mock_series_params = {
  name: 'jest test series',
  tournaments: [],
  admin: '651ff15e09e79c122e54b3b3',
  seriesCreated: '2023-6-10',
  seriesEnded: '2023-7-10',
}

const mock_tournament_params = {
  name: 'jest test tournament',
  ruleset: '651ff15e09e79c122e54b3b3',
  admin: [],
  date: '2014-03-12T13:37:27+00:00',
  maxPlayers: 24,
  invitationOnly: true,
}

describe('graphql api: series', () => {
  let createdSeriesId: String
  let createdTournamentId: String

  beforeAll(async () => {
    const data = await client.request(SAVE_TOURNEY, {
      createTourney: {
        ...mock_tournament_params,
      },
    })
    createdTournamentId = data.createTournament.id
  })

  test('Create series', async () => {
    const data = await client.request(CREATE_SERIES, {
      input: mock_series_params,
    })
    expect(data.createSeries.success).toEqual(true)
    expect(data.createSeries.message).toEqual('Series created successfully')
    createdSeriesId = data.createSeries.series.id
  })

  test('Get all series by admin', async () => {
    const data = await client.request(FETCH_SERIES, {
      adminId: mock_series_params.admin,
    })
    expect(data.allSeriesByAdmin).toContainEqual({
      id: createdSeriesId,
      name: mock_series_params.name,
      tournaments: [],
    })
  })

  test('Update series name', async () => {
    const newName = 'Updated Series Name'
    const data = await client.request(UPDATE_SERIES_NAME, {
      seriesId: createdSeriesId,
      name: newName,
    })
    expect(data.updateSeriesName.success).toEqual(true)
    expect(data.updateSeriesName.message).toEqual('Series name updated successfully')
  })

  test('Add tournament to series', async () => {
    const data = await client.request(ADD_TO_TOURNAMENT, {
      seriesId: createdSeriesId,
      tournamentId: createdTournamentId,
    })
    expect(data.addTournamentToSeries.success).toEqual(true)
    expect(data.addTournamentToSeries.message).toEqual('Tournament added to series successfully')
  })

  test('Fetch tournaments by series', async () => {
    const data = await client.request(GET_TOURNAMENTS_BY_SERIES, {
      seriesId: createdSeriesId,
    })
    expect(data.tournamentsBySeries).toContainEqual({
      id: createdTournamentId,
      name: mock_tournament_params.name,
    })
  })

  test('Delete tournament from series', async () => {
    const data = await client.request(DELETE_TOURNAMENT_FROM_SERIES, {
      seriesId: createdSeriesId,
      tournamentId: createdTournamentId,
    })
    expect(data.deleteTournamentFromSeries.success).toEqual(true)
    expect(data.deleteTournamentFromSeries.message).toEqual(
      'Tournament deleted from series successfully',
    )
  })

  test('Delete series', async () => {
    const data = await client.request(DELETE_SERIES, {
      id: createdSeriesId,
    })
    expect(data.deleteSeries).toEqual(true)
  })

  afterAll(async () => {
    const data = await client.request(DELETE_TOURNEY, {
      deleteTournamentId: createdTournamentId,
    })
    expect(data.deleteTournament).toEqual(true)
  })
})
