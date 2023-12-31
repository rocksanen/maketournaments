import Notification from '@/models/notificationModel'
import mongoose from 'mongoose'

let uri = 'null'

if (process.env.ENV !== 'test') {
  uri = process.env.MONGO_URI || 'null'
}
if (process.env.ENV === 'test') {
  uri = process.env.MONGO_URI_TEST || 'null'
}

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
