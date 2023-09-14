//TODO : series interface in mongoose schema
// It needs to have these following fields :
// name, tournaments as list, admin

import { Types } from "mongoose";
import { Document } from "mongoose";

interface Series extends Document {
    _id: number;
    name: string;
    tournaments: number[];
    admin: Types.ObjectId;
    seriesCreated: Date;
    seriesEnded: Date;
    }

export type {Series};
