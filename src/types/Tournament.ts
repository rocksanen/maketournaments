
import { Types } from "mongoose";
import { Document } from "mongoose";

interface Tournament extends Document {
    name: string;
    rules: Types.ObjectId[];
    date: Date;
    players: Types.ObjectId[];
    admin: Types.ObjectId[];
    matches: Types.ObjectId[];
    }

export type {Tournament};