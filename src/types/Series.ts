
import { Types } from "mongoose";
import { Document } from "mongoose";

interface Series extends Document {
    name: string;
    tournaments: number[];
    admin: Types.ObjectId;
    seriesCreated: Date;
    seriesEnded: Date;
    }

export type {Series};
