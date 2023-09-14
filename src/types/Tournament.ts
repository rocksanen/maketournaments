// TODO : tournament interface in mongoose schema
// It needs to have these following fields :
// name, rules as list, date, players, admin, matches,

import { Types } from "mongoose";
import { Document } from "mongoose";

interface Tournament extends Document {
    _id: number;
    name: string;
    rules: number[];
    date: Date;
    players: number[];
    admin: Types.ObjectId;
    matches: number[];
    }

export type {Tournament};