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
    provider: {
      type: String,
      default: 'credentials',
    },
  },
  { timestamps: true },
)

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
