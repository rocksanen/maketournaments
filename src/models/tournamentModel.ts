
import { Tournament } from '@/types/Tournament';
import mongoose, { Types } from 'mongoose';

const tournamentSchema = new mongoose.Schema<Tournament>({
    name: {
        type: String,
        required: true,
    },
    rules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rules',
        required: true,
    }],
    date: {
        type: Date,
        required: true,
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
});



const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema);
export default Tournament;