import mongoose from 'mongoose'
import UserModel from '@/models/userModel'

const uri = process.env.MONGO_URI || ''

mongoose.connect(uri)

console.log('Setting up change stream')

const pipeline = [
  {
    $match: {
      invitations: { $exists: true }, // Match documents where "invitations" field exists
    },
  },
  {
    $project: {
      invitations: 1, // Only include the 'invitations' field in the output
    },
  },
];

const changeStream = UserModel.watch(pipeline)

changeStream.on('change', (change) => {
  console.log('Change: ', change)
})

changeStream.on('error', (error) => {
  console.error('Error: ', error)
})

export { changeStream }
