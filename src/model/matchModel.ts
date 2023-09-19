import mongoose from "mongoose";
import { Schema, model, mongo } from "mongoose";
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

const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);
export default Match;