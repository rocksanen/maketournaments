// TODO: user interface in mongoose schema

import { Document } from "mongoose";

interface User extends Document {
    name: string;
    email: string;
    password: string;
    tournaments: number[];
    userCreated: Date;
  }

interface UserLogin {
    username: string;
    email: string;
    id: string;
  }
  
export type {User, UserLogin};
  