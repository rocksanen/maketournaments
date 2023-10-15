import { mergeTypeDefs } from '@graphql-tools/merge'
import { readFileSync } from 'fs'
import { join } from 'path'

import matchSchema from './Match.graphql'
import notificationSchema from './Notification.graphql'
import rulesetSchema from './Ruleset.graphql'
import seriesSchema from './Series.graphql'
import tournamentSchema from './Tournament.graphql'
import userSchema from './User.graphql'

const typeDefs = mergeTypeDefs([
  //   readFileSync(require.resolve('./Match.graphql'), 'utf8'),
  //   readFileSync(require.resolve('./Notification.graphql'), 'utf8'),
  //   readFileSync(require.resolve('./Ruleset.graphql'), 'utf8'),
  //   readFileSync(require.resolve('./Series.graphql'), 'utf8'),
  //   readFileSync(require.resolve('./Tournament.graphql'), 'utf8'),
  //   readFileSync(require.resolve('./User.graphql'), 'utf8'),
  matchSchema,
  notificationSchema,
  rulesetSchema,
  seriesSchema,
  tournamentSchema,
  userSchema,
])

export default typeDefs
