

import { Series } from '@/types/Series';
import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema<Series>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    tournaments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament'
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seriesCreated: {
        type: Date,
        default: Date.now,
        required: true,
    },
    seriesEnded: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<Series>('Series', seriesSchema);


