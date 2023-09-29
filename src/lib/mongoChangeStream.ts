import mongoose from 'mongoose'
import UserModel from '@/models/userModel'

const uri = process.env.MONGO_URI || ''

mongoose.connect(uri)

console.log('Setting up change stream')

const changeStream = UserModel.watch()

changeStream.on('change', (change) => {
  console.log('Change: ', change)
})

changeStream.on('error', (error) => {
  console.error('Error: ', error)
})

export { changeStream }