

import { Schema, model } from "mongoose";
import { Match } from "@/types/Match";

const matchSchema = new Schema<Match>({
   players: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
});

export default model<Match>('Match', matchSchema);
