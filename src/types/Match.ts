
import { Types } from "mongoose";
import { Document } from "mongoose";

interface Match extends Document {
    players: number[];
    winner: Types.ObjectId;
    startTime: Date;
    endTime: Date;
}

export type {Match};