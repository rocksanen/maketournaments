import { Document } from "mongoose";

interface User extends Document {
    name: string;
    email: string;
    password: string;
    tournaments: number[];
    provider: string;
  }
  
export type {User};
  