

import { Schema, model } from "mongoose";
import { Rules } from "@/types/Rules";

const rulesSchema = new Schema<Rules>({
    rounds: {
        type: Number,
        required: true,
    },
    winnerpoints: {
        type: Number,
        required: true,
    },
    loserpoints: {
        type: Number,
        required: true,
    },
    drawpoints: {
        type: Number,
        required: true,
    },
    nightmarepoints: {
        type: Number,
        required: true,
    },
    nightmarePointsOn: {
        type: Boolean,
        required: true,
    },
});

export default model<Rules>('Rules', rulesSchema);