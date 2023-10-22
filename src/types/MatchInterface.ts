import { Types, Document } from 'mongoose'

interface MatchFormat extends Document {
  players: Types.ObjectId[]
  winner: Types.ObjectId
  tie: boolean
  startTime: Date
  endTime: Date
  totalTime: number
}

export type { MatchFormat }
