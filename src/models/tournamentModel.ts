import { Tournament } from '@/types/Tournament'
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
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  ],
  invitationOnly: {
    type: Boolean,
    required: true,
  },
  maxPlayers: {
    type: Number,
    required: true,
  },
})

const TournamentModel = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema)
export default TournamentModel
