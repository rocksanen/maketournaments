import mongoose, { Schema, model } from 'mongoose'
import { Ruleset } from '@/types/Ruleset'

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

const Ruleset = mongoose.models.Ruleset || mongoose.model('Ruleset', rulesetSchema)
export default Ruleset
