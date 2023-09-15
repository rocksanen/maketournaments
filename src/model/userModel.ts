
import { User } from '@/types/User';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  tournaments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  }],
  provider: {
    type: String,
    default: 'credentials'
  }
}, { timestamps: true })

// checking if the model exists, then use it else create it.
const userModel = mongoose.models.User || mongoose.model<User>('User', userSchema)

export default userModel;
