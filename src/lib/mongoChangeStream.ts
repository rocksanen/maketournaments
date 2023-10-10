import mongoose from 'mongoose'
import Notification from '@/models/notificationModel'

const uri = process.env.MONGO_URI || ''

mongoose.connect(uri)

console.log('Setting up change stream')

const changeStream = Notification.watch()

changeStream.on('change', (change) => {
  //console.log('Change: ', change)
})

changeStream.on('error', (error) => {
  console.error('Error: ', error)
})

export { changeStream }
