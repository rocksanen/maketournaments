import { Document, Types } from 'mongoose'
//add field notifications to user, it has sender, message, date

interface User extends Document {
  name: string
  email: string
  password: string
  tournaments: Types.ObjectId[]
  friends: Types.ObjectId[]
  invitations: Types.ObjectId[]
  provider: string
}

export type { User }
