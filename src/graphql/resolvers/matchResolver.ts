import matchModel from '@/models/matchModel'
import { Context } from '@/types/Context'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'
import mockSessionResolver from '../../lib/sessionResolver'

interface CreateMatchInput {
  players: string[] // Array of User IDs
  winner?: string // Optional User ID
  startTime: string
  endTime: string
}

interface UpdateMatchInput {
  id: string
  players?: string[] // Array of User IDs
  winner?: string // Optional User ID
  startTime?: string
  endTime?: string
}

interface MatchArgs {
  id: string
}

interface CreateMatchArgs {
  input: CreateMatchInput
}

interface UpdateMatchArgs {
  input: UpdateMatchInput
}

interface DeleteMatchArgs {
  id: string
}

const matchResolvers = {
  Query: {
    match: async (_: any, { id }: MatchArgs) => {
      try {
        const match = await matchModel.findById(id).populate('players winner')
        return match
      } catch (error) {
        console.error('Failed to fetch match:', error)
        throw new Error('Failed to fetch match')
      }
    },

    allMatches: async (_: any, { limit, offset }: paginationArgs) => {
      try {
        const matches = await matchModel
          .find()
          .populate('players winner')
          .limit(Math.min(limit, MAX_QUERY_LIMIT))
          .skip(offset * Math.min(limit, MAX_QUERY_LIMIT))
        return matches
      } catch (error) {
        console.error('Failed to fetch matches:', error)
        throw new Error('Failed to fetch matches')
      }
    },
  },

  Mutation: {
    createMatch: async (_: any, { input }: CreateMatchArgs, context: Context) => {
      const testSession = await mockSessionResolver(context)
      if (testSession) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const newMatch = new matchModel({
          ...input,
        })

        const result = await newMatch.save()
        return result
      } catch (error) {
        console.error('Failed to create match:', error)
        throw new Error('Failed to create match')
      }
    },

    updateMatch: async (_: any, { input }: UpdateMatchArgs, context: Context) => {
      const testSession = await mockSessionResolver(context)
      if (testSession) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      const { id, ...rest } = input
      try {
        const updatedMatch = await matchModel
          .findByIdAndUpdate(id, rest, {
            new: true, // returns the updated document
          })
          .populate('players winner')
        return updatedMatch
      } catch (error) {
        console.error('Failed to update match:', error)
        throw new Error('Failed to update match')
      }
    },

    deleteMatch: async (_: any, { id }: DeleteMatchArgs, context: Context) => {
      const testSession = await mockSessionResolver(context)
      if (testSession) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const deletedMatch = await matchModel.findByIdAndRemove(id)
        if (!deletedMatch) {
          throw new Error('Match not found')
        }
        return true
      } catch (error) {
        console.error('Failed to delete match:', error)
        throw new Error('Failed to delete match')
      }
    },
  },
}

export default matchResolvers
