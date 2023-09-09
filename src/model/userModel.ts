// TODO: mongoose schema for user
import { User } from '@/types/User';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {type: String, required: true},
});


const userModel = mongoose.model<User>('User', userSchema);

export default userModel;
