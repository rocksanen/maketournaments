import { Document } from 'mongoose'

interface Note extends Document {
  receiverEmail: string
  senderEmail: string
  message: string
  date: Date
}

interface NoteInput {
  receiverEmail: string
  senderEmail: string
  message: string
  date: Date
}

export type { Note, NoteInput }
