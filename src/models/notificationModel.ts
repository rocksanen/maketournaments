import { Note } from '@/types/Notification'
import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema<Note>({
  receiverEmail: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
})

const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
export default Notification
