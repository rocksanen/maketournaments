import seriesModel from '@/models/seriesModel'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'

interface SeriesArgs {
  id: string
}

interface CreateSeriesArgs {
  input: {
    name: string
    tournaments: string[]
    admin: string
    seriesCreated: string
    seriesEnded?: string
  }
}

interface UpdateSeriesArgs {
  input: {
    id: string
    name?: string
    tournaments?: string[]
    admin?: string
    seriesCreated?: string
    seriesEnded?: string
  }
}

interface DeleteSeriesArgs {
  id: string
}

const seriesResolvers = {
  Query: {
    series: async (_: any, { id }: SeriesArgs) => {
      try {
        const series = await seriesModel.findById(id).populate('tournaments admin')
        return series
      } catch (error) {
        console.error('Failed to fetch series:', error)
        throw new Error('Failed to fetch series')
      }
    },

    allSeries: async (_: any, { limit, offset }: paginationArgs) => {
      try {
        const seriesList = await seriesModel
          .find()
          .populate('tournaments admin')
          .limit(Math.min(limit, MAX_QUERY_LIMIT))
          .skip(offset * Math.min(limit, MAX_QUERY_LIMIT))
        return seriesList
      } catch (error) {
        console.error('Failed to fetch series list:', error)
        throw new Error('Failed to fetch series list')
      }
    },
  },

  Mutation: {
    createSeries: async (_: any, { input }: CreateSeriesArgs) => {
      try {
        const newSeries = new seriesModel(input)
        const result = await newSeries.save()
        return result
      } catch (error) {
        console.error('Failed to create series:', error)
        throw new Error('Failed to create series')
      }
    },

    updateSeries: async (_: any, { input }: UpdateSeriesArgs) => {
      const { id, ...rest } = input
      try {
        const updatedSeries = await seriesModel.findByIdAndUpdate(id, rest, {
          new: true, // returns the updated document
        })
        return updatedSeries
      } catch (error) {
        console.error('Failed to update series:', error)
        throw new Error('Failed to update series')
      }
    },

    deleteSeries: async (_: any, { id }: DeleteSeriesArgs) => {
      try {
        const deletedSeries = await seriesModel.findByIdAndRemove(id)
        if (!deletedSeries) {
          throw new Error('Series not found')
        }
        return true
      } catch (error) {
        console.error('Failed to delete series:', error)
        throw new Error('Failed to delete series')
      }
    },
  },
}

export default seriesResolvers
