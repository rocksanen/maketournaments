import { Document, Types } from 'mongoose'

interface Notification {
  type: string
  message: string
  documentKey: {
    _id: string
  }
}

interface User extends Document {
  name: string
  email: string
  password: string
  tournaments: Types.ObjectId[]
  friends: Types.ObjectId[]
  invitations: Types.ObjectId[]
  notifications: Notification[]
  provider: string
}

export type { User }
