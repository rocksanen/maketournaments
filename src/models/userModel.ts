import { User } from '@/types/User'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    tournaments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    invitations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
      },
    ],
    provider: {
      type: String,
      default: 'credentials',
    },
    notifications: [
      {
        sender: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)
export default UserModel
