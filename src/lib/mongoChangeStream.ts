import mongoose from 'mongoose'
import UserModel from '@/models/userModel'

const uri = process.env.MONGO_URI || ''

mongoose.connect(uri)

console.log('Setting up change stream')

const changeStream = UserModel.watch([
  { $match: { 'updateDescription.updatedFields.invitations': { $exists: true } } },
])

changeStream.on('change', (change) => {
  const tournamentId = change.updateDescription.updatedFields.invitations[0]
  const userId = change.documentKey._id
  console.log(`User ${userId} received an invitation to tournament ${tournamentId}`)
})

changeStream.on('error', (error) => {
  console.error('Error: ', error)
})

export { changeStream }
