import mongoose from 'mongoose'
import UserModel from '@/models/userModel'
import EventEmitter from 'events'

const newInvitationEmitter = new EventEmitter()

const uri = process.env.MONGO_URI || ''

mongoose.connect(uri)

console.log('Setting up change stream')

const changeStream = UserModel.watch([
  { $match: { 'updateDescription.updatedFields.invitations': { $exists: true } } },
])

changeStream.on('change', (change) => {
  console.log('Change: ', change)

  if (change.updateDescription.updatedFields.invitations) {
    const invitationId = change.updateDescription.updatedFields.invitations[0]
    newInvitationEmitter.emit('newInvitation', {
      type: 'newInvitation', // Customize as needed
      message: `New Invitation: ${invitationId}`,
    })
  }
})

changeStream.on('error', (error) => {
  console.error('Error: ', error)
})

export { newInvitationEmitter } // <-- Exporting only the emitter
