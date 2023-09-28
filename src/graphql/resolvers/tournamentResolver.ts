import Tournament from '@/models/tournamentModel'
import { Ruleset } from '@/types/Ruleset'
import { User } from '@/types/User'
import { Match } from '@/types/Match'
import { renameIdField } from '@/utils/idCon'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'

interface CreateTournamentArgs {
  input: {
    name: string
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
    rules?: Ruleset[]
    date?: string
    players?: User[]
    admin?: User[]
    matches?: Match[]
  }
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
  },

  Mutation: {
    createTournament: async (_: any, { input }: CreateTournamentArgs) => {
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

    updateTournament: async (_: any, args: UpdateTournamentArgs) => {
      const { id, ...inputData } = args.input

      try {
        const updatedTournament = await Tournament.findByIdAndUpdate(id, inputData, {
          new: true,
        }).populate('rules admin players matches')

        const resultObj = updatedTournament.toJSON()
        const out = renameIdField(resultObj)

        return out
      } catch (error) {
        console.error('Failed to update tournament:', error)
        throw new Error('Failed to update tournament')
      }
    },

    deleteTournament: async (_: any, { id }: { id: string }) => {
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
