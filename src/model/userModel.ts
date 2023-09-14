// TODO: mongoose schema for user
// schema has to have these following fields :
// name, email, password, tournaments where user is either admin or user, isAdmin in a specific tournament
import { User } from '@/types/User';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, 
    required: true
  },
  tournaments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  }],
  userCreated: {
    type: Date,
    default: Date.now,
  },
});


const userModel = mongoose.model<User>('User', userSchema);

export default userModel;
