import RulesModel from '@/models/rulesModel'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'

interface CreateRulesArgs {
  input: {
    rounds: number
    winnerpoints: number
    loserpoints: number
    drawpoints: number
    nightmarepoints: number
    nightmarePointsOn: boolean
  }
}

interface UpdateRulesArgs {
  input: {
    id: string
    rounds?: number
    winnerpoints?: number
    loserpoints?: number
    drawpoints?: number
    nightmarepoints?: number
    nightmarePointsOn?: boolean
  }
}

const rulesResolvers = {
  Query: {
    rules: async (_: any, { id }: { id: string }) => {
      try {
        const rule = await RulesModel.findById(id)
        return rule
      } catch (error) {
        console.error('Failed to fetch rules:', error)
        throw new Error('Failed to fetch rules')
      }
    },

    allRules: async (_: any, { limit, offset }: paginationArgs) => {
      try {
        const rules = await RulesModel.find()
          .limit(Math.min(limit, MAX_QUERY_LIMIT))
          .skip(offset * Math.min(limit, MAX_QUERY_LIMIT))
        return rules
      } catch (error) {
        console.error('Failed to fetch all rules:', error)
        throw new Error('Failed to fetch all rules')
      }
    },
  },

  Mutation: {
    createRules: async (_: any, { input }: CreateRulesArgs) => {
      try {
        const newRule = new RulesModel(input)
        const result = await newRule.save()
        return result
      } catch (error) {
        console.error('Failed to create rules:', error)
        throw new Error('Failed to create rules')
      }
    },

    updateRules: async (_: any, { input }: UpdateRulesArgs) => {
      const { id, ...rest } = input
      try {
        const updatedRule = await RulesModel.findByIdAndUpdate(id, rest, {
          new: true,
        })
        return updatedRule
      } catch (error) {
        console.error('Failed to update rules:', error)
        throw new Error('Failed to update rules')
      }
    },

    deleteRules: async (_: any, { id }: { id: string }) => {
      try {
        const deletedRule = await RulesModel.findByIdAndRemove(id)
        if (!deletedRule) {
          throw new Error('Rules not found')
        }
        return true
      } catch (error) {
        console.error('Failed to delete rules:', error)
        throw new Error('Failed to delete rules')
      }
    },
  },
}

export default rulesResolvers
