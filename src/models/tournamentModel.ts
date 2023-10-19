import { Tournament } from '@/types/Tournament'
import matchFormat from '@/models/matchFormat'
import mongoose from 'mongoose'

const tournamentSchema = new mongoose.Schema<Tournament>({
  name: {
    type: String,
    required: true,
  },
  ruleset: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ruleset',
      required: true,
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  matches: [matchFormat],
  invitationOnly: {
    type: Boolean,
    required: true,
  },
  maxPlayers: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
})

const TournamentModel = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema)
export default TournamentModel
