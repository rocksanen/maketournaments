import { Types } from 'mongoose'
import { Document } from 'mongoose'

interface Match extends Document {
  tournamentId: Types.ObjectId
  players: Types.ObjectId[]
  winner: Types.ObjectId
  tie: boolean
  startTime: Date
  endTime: Date
}

export type { Match }
