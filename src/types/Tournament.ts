import { Tournament } from '@/types/Tournament';

import { Types } from "mongoose";
import { Document } from "mongoose";

interface Tournament extends Document {
    name: string;
    rules: number[];
    date: Date;
    players: number[];
    admin: Types.ObjectId[];
    matches: number[];
    }

interface TournamentInput {
    name: string;
    rules: number[];
    date: Date;
    players: number[];
    admin: Types.ObjectId[];
    matches: number[];
}

export type {Tournament, TournamentInput};