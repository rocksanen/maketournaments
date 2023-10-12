import seriesModel from '@/models/seriesModel'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'
import tournamentModel from '@/models/tournamentModel'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

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

interface addTournamentToSeriesArgs {
  tournamentId: string
  seriesId: string
}

interface deleteTournamentFromSeriesArgs {
  tournamentId: string
  seriesId: string
}
interface updateSeriesNameArgs {
  seriesId: string
  name: string
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

    allSeriesByAdmin: async (_: any, { adminId }: { adminId: string }) => {
      if (!adminId) {
        throw new Error('Please log in to view your series')
      }

      try {
        const seriesList = await seriesModel.find({ admin: adminId }).populate('tournaments admin')
        return seriesList
      } catch (error) {
        console.error('Failed to fetch series list by admin:', error)
        throw new Error('Failed to fetch series list by admin')
      }
    },
    tournamentsBySeries: async (_: any, { seriesId }: { seriesId: string }) => {
      try {
        const series = await seriesModel.findById(seriesId).populate('tournaments')
        if (!series) {
          throw new Error('Series not found')
        }
        return series.tournaments
      } catch (error) {
        console.error('Failed to fetch tournaments by series:', error)
        throw new Error('Failed to fetch tournaments by series')
      }
    },
  },

  Mutation: {
    createSeries: async (_: any, { input }: CreateSeriesArgs, context) => {
      const session = await getServerSession(context.req, context.res, authOptions)

      if (!session) {
        return {
          success: false,
          message: 'Please log in to create a series',
        }
      }

      try {
        const existingSeries = await seriesModel.findOne({
          name: input.name,
          admin: input.admin,
        })

        if (existingSeries) {
          return {
            success: false,
            message: 'Series with that name already exists',
          }
        }

        const newSeries = new seriesModel(input)
        const result = await newSeries.save()

        return {
          success: true,
          series: result,
          message: 'Series created successfully',
        }
      } catch (error) {
        console.error('Failed to create series:', error)
        return {
          success: false,
          message: 'Failed to create series due to an unexpected error.',
        }
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

    addTournamentToSeries: async (
      _: any,
      { seriesId, tournamentId }: addTournamentToSeriesArgs,
    ) => {
      try {
        const series = await seriesModel.findById(seriesId)
        if (!series) {
          throw new Error('Series not found')
        }

        const tournament = await tournamentModel.findById(tournamentId)
        if (!tournament) {
          throw new Error('Tournament not found')
        }

        const tournamentExists = series.tournaments.includes(tournamentId)
        if (tournamentExists) {
          return { success: false, message: 'Tournament already exists in the series' }
        }

        series.tournaments.push(tournamentId)
        await series.save()

        return { success: true, message: 'Tournament added to series successfully' }
      } catch (error) {
        console.error('Error adding tournament to series:', error)
        throw new Error('Error adding tournament to series')
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
    deleteTournamentFromSeries: async (
      _: any,
      { seriesId, tournamentId }: deleteTournamentFromSeriesArgs,
    ) => {
      try {
        const series = await seriesModel.findById(seriesId)
        if (!series) {
          throw new Error('Series not found')
        }

        const tournament = await tournamentModel.findById(tournamentId)
        if (!tournament) {
          throw new Error('Tournament not found')
        }

        // pull the tournament from the series
        const result = await seriesModel.findByIdAndUpdate(
          seriesId,
          { $pull: { tournaments: tournamentId } },
          { new: true },
        )

        if (!result) {
          return { success: false, message: 'Tournament was not removed from series' }
        }

        return { success: true, message: 'Tournament deleted from series successfully' }
      } catch (error) {
        console.error('Error deleting tournament from series:', error)
        throw new Error('Error deleting tournament from series')
      }
    },
    updateSeriesName: async (_: any, { seriesId, name }: updateSeriesNameArgs) => {
      try {
        const seriesToUpdate = await seriesModel.findById(seriesId)
        if (!seriesToUpdate) {
          return {
            success: false,
            message: 'Series not found',
          }
        }

        const existingSeries = await seriesModel.findOne({
          name: name,
          admin: seriesToUpdate.admin,
        })

        if (existingSeries && String(existingSeries._id) !== String(seriesId)) {
          return {
            success: false,
            message: 'Series with that name already exists',
          }
        }

        seriesToUpdate.name = name
        await seriesToUpdate.save()

        return { success: true, message: 'Series name updated successfully' }
      } catch (error) {
        console.error('Error updating series name:', error)
        throw new Error('Error updating series name')
      }
    },
  },
}

export default seriesResolvers
