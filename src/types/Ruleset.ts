import { Document } from 'mongoose'

interface Ruleset extends Document {
  rounds: number
  winnerpoints: number
  loserpoints: number
  drawpoints: number
  nightmarepoints: number
  nightmarePointsOn: boolean
}

interface RulesetInput {
  id: string
  rounds: number
  winnerpoints: number
  loserpoints: number
  drawpoints: number
  nightmarepoints: number
  nightmarePointsOn: boolean
}

export type { Ruleset, RulesetInput }
