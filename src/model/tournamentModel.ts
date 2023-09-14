
import { Tournament } from '@/types/Tournament';
import mongoose, { Types } from 'mongoose';

const tournamentSchema = new mongoose.Schema<Tournament>({
    name: {
        type: String,
        required: true,
    },
    rules: [{
        type: Types.ObjectId,
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
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
});

export default mongoose.model<Tournament>('Tournament', tournamentSchema);s