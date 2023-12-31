import RulesetModel from '@/models/rulesetModel'
import { Context } from '@/types/Context'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'
import mockSessionResolver from '../../lib/mockSessionResolver'

interface CreateRulesetArgs {
  input: {
    name: string
    rounds: number
    winnerpoints: number
    loserpoints: number
    drawpoints: number
    nightmarepoints: number
    nightmarePointsOn: boolean
  }
}

interface UpdateRulesetArgs {
  input: {
    id: string
    name?: string
    rounds?: number
    winnerpoints?: number
    loserpoints?: number
    drawpoints?: number
    nightmarepoints?: number
    nightmarePointsOn?: boolean
  }
}

const rulesetResolvers = {
  Query: {
    ruleset: async (_: any, { id }: { id: string }) => {
      try {
        const ruleset = await RulesetModel.findById(id)
        return ruleset
      } catch (error) {
        console.error('Failed to fetch ruleset:', error)
        throw new Error('Failed to fetch ruleset')
      }
    },

    allRulesets: async (_: any, { limit, offset }: paginationArgs) => {
      try {
        const ruleset = await RulesetModel.find()
          .limit(Math.min(limit, MAX_QUERY_LIMIT))
          .skip(offset * Math.min(limit, MAX_QUERY_LIMIT))
        return ruleset
      } catch (error) {
        console.error('Failed to fetch all ruleset:', error)
        throw new Error('Failed to fetch all ruleset')
      }
    },
  },

  Mutation: {
    createRuleset: async (_: any, { input }: CreateRulesetArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const newRuleset = new RulesetModel(input)
        const result = await newRuleset.save()
        console.log(result)
        return result
      } catch (error) {
        console.error('Failed to create ruleset:', error)
        throw new Error('Failed to create ruleset')
      }
    },

    updateRuleset: async (_: any, { input }: UpdateRulesetArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      const { id, ...rest } = input
      try {
        const updatedRuleset = await RulesetModel.findByIdAndUpdate(id, rest, {
          new: true,
        })
        return updatedRuleset
      } catch (error) {
        console.error('Failed to update ruleset:', error)
        throw new Error('Failed to update ruleset')
      }
    },

    deleteRuleset: async (_: any, { id }: { id: string }, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const deletedRuleset = await RulesetModel.findByIdAndRemove(id)
        if (!deletedRuleset) {
          throw new Error('Ruleset not found')
        }
        return true
      } catch (error) {
        console.error('Failed to delete ruleset:', error)
        throw new Error('Failed to delete ruleset')
      }
    },
  },
}

export default rulesetResolvers
