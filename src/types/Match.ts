// TODO : match interface in mongoose schema
// It needs to have these following fields :
// players as list, winner, loser, date, startTime, endTime

import { Types } from "mongoose";
import { Document } from "mongoose";

interface Match extends Document {
    _id: number;
    players: number[];
    winner: Types.ObjectId;
    startTime: Date;
    endTime: Date;
}

export type {Match};