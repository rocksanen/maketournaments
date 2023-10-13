import Tournament from '@/models/tournamentModel'
import { Ruleset } from '@/types/Ruleset'
import { User } from '@/types/User'
import { Match } from '@/types/Match'
import { renameIdField } from '@/utils/idCon'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'
import { Context } from '@/types/Context'
import mockSessionResolver from '../../lib/mockSessionResolver'

interface CreateTournamentArgs {
  input: {
    name: string
    description: string
    rules: Ruleset[]
    date: string
    players?: User[]
    admin: User[]
    invitationOnly: boolean
    maxPlayers: number
    matches?: Match[]
  }
}

interface UpdateTournamentArgs {
  input: {
    id: string
    name?: string
    description?: string
    rules?: Ruleset[]
    date?: string
    players?: User[]
    admin?: User[]
    matches?: Match[]
  }
}

interface GetTournamentsByIdsArgs {
  ids: string[]
}

const tournamentResolvers = {
  Query: {
    tournament: async (_: any, { id }: { id: string }) => {
      try {
        const tournament = await Tournament.findById(id).populate('ruleset admin players matches')
        return tournament
      } catch (error) {
        console.error('Failed to fetch tournament:', error)
        throw new Error('Failed to fetch tournament')
      }
    },

    tournamentByName: async (_: any, { name }: { name: string }) => {
      try {
        const tournament = await Tournament.findOne({ name }).populate(
          'ruleset admin players matches',
        )
        return tournament
      } catch (error) {
        console.error('Failed to fetch tournament:', error)
        throw new Error('Failed to fetch tournament')
      }
    },

    allTournaments: async (_: any, { limit, offset }: paginationArgs) => {
      try {
        const tournaments = await Tournament.find()
          .populate('ruleset admin players matches')
          .limit(Math.min(limit, MAX_QUERY_LIMIT))
          .skip(offset * Math.min(limit, MAX_QUERY_LIMIT))
        return tournaments
      } catch (error) {
        console.error('Failed to fetch tournaments:', error)
        throw new Error('Failed to fetch tournaments')
      }
    },
    tournamentsByUser: async (_: any, { userId }: { userId: string }) => {
      try {
        const tournaments = await Tournament.find({
          $or: [{ admin: userId }, { players: userId }],
        })
          .populate('ruleset admin players')
          .populate({
            path: 'matches',
            populate: [
              {
                path: 'winner',
                model: 'User',
              },
              {
                path: 'players',
                model: 'User',
              },
            ],
          })

        if (!tournaments || tournaments.length === 0) {
          return []
        }

        const transformedTournaments = tournaments.map((tournament) => {
          return tournament.toObject()
        })

        const output = transformedTournaments.map((tournament) => renameIdField(tournament))
        return output
      } catch (error) {
        console.error('Failed to fetch tournaments for user:', error)
        throw new Error('Failed to fetch tournaments for user')
      }
    },
    tournamentsByNameAndUser: async (
      _: any,
      { name, userId }: { name: string; userId: string },
    ) => {
      try {
        const tournaments = await Tournament.findOne({
          name,
          $or: [{ admin: userId }, { players: userId }],
        }).populate('ruleset admin players matches')
        return tournaments
      } catch (error) {
        console.error('Failed to fetch tournaments for user:', error)
        throw new Error('Failed to fetch tournaments for user')
      }
    },
    getTournamentsByIds: async (_: any, { ids }: GetTournamentsByIdsArgs) => {
      try {
        const tournaments = await Tournament.find({ _id: { $in: ids } }).populate(
          'ruleset admin players matches',
        )
        return tournaments
      } catch (error) {
        console.error('Failed to fetch tournaments by IDs:', error)
        throw new Error('Failed to fetch tournaments by IDs')
      }
    },
  },

  Mutation: {
    createTournament: async (_: any, { input }: CreateTournamentArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const newTournament = new Tournament({
          ...input,
        })

        const savedTournament = await newTournament.save()

        // Use the Model to fetch and populate the document
        const result = await Tournament.findById(savedTournament._id).populate(
          'ruleset admin players matches',
        )

        if (!result) {
          throw new Error('Failed to retrieve and populate saved tournament')
        }

        const resultObj = result.toJSON()
        const out = renameIdField(resultObj)

        return out
      } catch (error) {
        console.error('Failed to create tournament:', error)
        throw new Error('Failed to create tournament')
      }
    },

    updateTournament: async (_: any, args: UpdateTournamentArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      const { id, ...inputData } = args.input

      try {
        const updatedTournament = await Tournament.findByIdAndUpdate(id, inputData, {
          new: true,
        }).populate('ruleset admin players matches')

        const resultObj = updatedTournament.toJSON()
        const out = renameIdField(resultObj)

        console.log('Updated tournament:', out)

        return out
      } catch (error) {
        console.error('Failed to update tournament:', error)
        throw new Error('Failed to update tournament')
      }
    },
    updateTournamentPlayers: async (
      _: any,
      args: { tournamentId: string; playerId: string },
      context: Context,
    ) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }

      const { tournamentId, playerId } = args

      try {
        const existingTournament = await Tournament.findById(tournamentId)

        if (!existingTournament) {
          throw new Error('Tournament not found')
        }

        // Ensure players is initialized to an array if it's null or undefined
        if (!existingTournament.players) {
          existingTournament.players = []
        }

        // Check if the playerId already exists in the players array
        if (!existingTournament.players.includes(playerId)) {
          existingTournament.players.push(playerId)
          await existingTournament.save()

          // Fetch the updated tournament document to ensure you're returning the latest version
          const updatedTournament = await Tournament.findById(tournamentId).populate(
            'ruleset admin players matches',
          )
          const resultObj = updatedTournament.toJSON()
          const out = renameIdField(resultObj)
          console.log('Added player to tournament:', out)
          return out
        } else {
          throw new Error('Player already added to tournament')
        }
      } catch (error) {
        console.error('Failed to add player to tournament:', error)
        throw new Error('Failed to add player to tournament')
      }
    },

    deleteTournament: async (_: any, { id }: { id: string }, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const deletedTournament = await Tournament.findByIdAndRemove(id)
        if (!deletedTournament) {
          throw new Error('Tournament not found')
        }

        return true
      } catch (error) {
        console.error('Failed to delete tournament:', error)
        throw new Error('Failed to delete tournament')
      }
    },
  },
}

export default tournamentResolvers
