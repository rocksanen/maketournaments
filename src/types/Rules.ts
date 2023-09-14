// TODO : rules interface in mongoose schema
// It needs to have these following fields :
// rounds, winnerpoints, loserpoints, drawpoints

import { Document } from "mongoose";

interface Rules extends Document {
    _id: number;
    rounds: number;
    winnerpoints: number;
    loserpoints: number;
    drawpoints: number;
    nightmarepoints: number;
    nightmarePointsOn: boolean;
}

export type {Rules};
