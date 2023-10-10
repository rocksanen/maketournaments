import userResolvers from './userResolver'
import rulesetResolvers from './rulesetResolver'
import tournamentResolvers from './tournamentResolver'
import matchResolvers from './matchResolver'
import seriesResolvers from './seriesResolver'
import notificationResolvers from './notificationResolver'

const resolvers = [
  userResolvers,
  rulesetResolvers,
  tournamentResolvers,
  matchResolvers,
  seriesResolvers,
  notificationResolvers,
]

export default resolvers
