import { gql } from '@apollo/client'

const CREATE_SERIES = gql`
  mutation CreateSeries($input: SeriesInput!) {
    createSeries(input: $input) {
      success
      message
      series {
        id
        name
        tournaments {
          id
          name
        }
      }
    }
  }
`

const DELETE_SERIES = gql`
  mutation DeleteSeries($id: ID!) {
    deleteSeries(id: $id)
  }
`

const ADD_TO_TOURNAMENT = gql`
  mutation addTournamentToSeries($seriesId: ID!, $tournamentId: ID!) {
    addTournamentToSeries(seriesId: $seriesId, tournamentId: $tournamentId) {
      success
      message
    }
  }
`

const DELETE_TOURNAMENT_FROM_SERIES = gql`
  mutation deleteTournamentFromSeries($seriesId: ID!, $tournamentId: ID!) {
    deleteTournamentFromSeries(seriesId: $seriesId, tournamentId: $tournamentId) {
      success
      message
    }
  }
`

const FETCH_SERIES = gql`
  query GetAllSeries($adminId: ID) {
    allSeriesByAdmin(adminId: $adminId) {
      id
      name
      tournaments {
        id
        name
      }
    }
  }
`

const GET_TOURNAMENTS_BY_SERIES = gql`
  query GetTournamentsBySeries($seriesId: ID!) {
    tournamentsBySeries(seriesId: $seriesId) {
      id
      name
    }
  }
`

const UPDATE_SERIES_NAME = gql`
  mutation updateSeriesName($seriesId: ID!, $name: String!) {
    updateSeriesName(seriesId: $seriesId, name: $name) {
      success
      message
    }
  }
`

export {
  CREATE_SERIES,
  DELETE_SERIES,
  ADD_TO_TOURNAMENT,
  DELETE_TOURNAMENT_FROM_SERIES,
  GET_TOURNAMENTS_BY_SERIES,
  FETCH_SERIES,
  UPDATE_SERIES_NAME,
}
