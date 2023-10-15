import { Ruleset } from '@/types/Ruleset'
import mongoose, { Schema } from 'mongoose'

const rulesetSchema = new Schema<Ruleset>({
  name: {
    type: String,
    required: true,
  },
  rounds: {
    type: Number,
    required: true,
  },
  winnerpoints: {
    type: Number,
    required: true,
  },
  loserpoints: {
    type: Number,
    required: true,
  },
  drawpoints: {
    type: Number,
    required: true,
  },
  nightmarepoints: {
    type: Number,
    required: true,
  },
  nightmarePointsOn: {
    type: Boolean,
    required: true,
  },
})

const RulesetModel = mongoose.models.Ruleset || mongoose.model('Ruleset', rulesetSchema)
export default RulesetModel
