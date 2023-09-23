
import { Types } from "mongoose";
import { Document } from "mongoose";

interface Series extends Document {
    name: string;
    tournaments: Types.ObjectId[];
    admin: Types.ObjectId;
    seriesCreated: Date;
    seriesEnded: Date;
    }

export type {Series};
