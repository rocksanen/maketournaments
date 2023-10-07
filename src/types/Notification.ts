import { Document } from 'mongoose'

interface Note extends Document {
  receiverEmail: string
  senderEmail: string
  message: string
  date: Date
  isRead: boolean
}

interface NoteInput {
  receiverEmail: string
  senderEmail: string
  message: string
  date: Date
  isRead: boolean
}

export type { Note, NoteInput }
