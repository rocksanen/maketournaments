import { Document } from 'mongoose'

interface Ruleset extends Document {
  id: string
  name: string
  rounds: number
  winnerpoints: number
  loserpoints: number
  drawpoints: number
  nightmarepoints: number
  nightmarePointsOn: boolean
}

interface RulesetInput {
  name: string
  rounds: number
  winnerpoints: number
  loserpoints: number
  drawpoints: number
  nightmarepoints: number
  nightmarePointsOn: boolean
}

interface RulesetOutput {
  id: string
  name: string
  rounds: number
  winnerpoints: number
  loserpoints: number
  drawpoints: number
  nightmarepoints: number
  nightmarePointsOn: boolean
}

export type { Ruleset, RulesetInput, RulesetOutput }
