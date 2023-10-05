import mongoose from 'mongoose'
import UserModel from '@/models/userModel'

let userId: string
let filter: any
let options: any

function setupChangeStream(id: string) {
  const uri = process.env.MONGO_URI || ''
  userId = id
  mongoose.connect(uri)

  console.log('Setting up change stream')
  filter = [
    {
      $match: {
        'documentKey._id': new mongoose.Types.ObjectId(userId),
      },
    },
  ]
  options = { fullDocument: 'invitations' }
}

const changeStream = UserModel.watch(filter, options)

changeStream.on('change', (change) => {
  console.log('Change: ', change)
})

changeStream.on('error', (error) => {
  console.error('Error: ', error)
})

export { setupChangeStream, changeStream }
