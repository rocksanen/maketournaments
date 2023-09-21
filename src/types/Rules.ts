
import { Document } from "mongoose";

interface Rules extends Document {
    rounds: number;
    winnerpoints: number;
    loserpoints: number;
    drawpoints: number;
    nightmarepoints: number;
    nightmarePointsOn: boolean;
}

export type {Rules};
