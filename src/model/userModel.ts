
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


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
