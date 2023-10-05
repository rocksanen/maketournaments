import mongoose from 'mongoose'
import UserModel from '@/models/userModel'

let userId: string
let pipeline: any

function setupChangeStream(id: string) {
  const uri = process.env.MONGO_URI || ''
  userId = id
  console.log(userId, 'Setting up change stream user id')
  mongoose.connect(uri)

  console.log('Setting up change stream')
  pipeline = [
    {
      $match: {
        'documentKey._id': new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        invitations: 1, // Only include the 'invitations' field in the output
      },
    },
  ]
}

const changeStream = UserModel.watch(pipeline)

changeStream.on('change', (change) => {
  console.log('Change: ', change)
})

changeStream.on('error', (error) => {
  console.error('Error: ', error)
})

export { setupChangeStream, changeStream }
