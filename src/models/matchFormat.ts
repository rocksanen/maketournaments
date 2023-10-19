import mongoose from 'mongoose'

const matchFormat = {
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tie: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  totalTime: {
    type: Number,
    required: true,
  },
}

export default matchFormat
