import { Match } from '@/types/Match'
import mongoose, { Schema } from 'mongoose'

const matchSchema = new Schema<Match>({
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
})

const MatchModel = mongoose.models.Match || mongoose.model('Match', matchSchema)
export default MatchModel
