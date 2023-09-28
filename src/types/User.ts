import { Document, Types } from 'mongoose'

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
