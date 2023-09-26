import userResolvers from './userResolver'
import rulesetResolvers from './rulesetResolver'
import tournamentResolvers from './tournamentResolver'
import matchResolvers from './matchResolver'
import seriesResolvers from './seriesResolver'

const resolvers = [
  userResolvers,
  rulesetResolvers,
  tournamentResolvers,
  matchResolvers,
  seriesResolvers,
]

export default resolvers
