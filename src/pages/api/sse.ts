import { NextApiRequest, NextApiResponse } from 'next'
import { changeStream } from '@/lib/mongoChangeStream'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (req.headers.accept && req.headers.accept === 'text/event-stream') {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const HEARTBEAT_INTERVAL = 5000
    const intervalId = setInterval(() => {
      res.write(': heartbeat\n\n')
    }, HEARTBEAT_INTERVAL)

    const sendUpdate = (data: { [key: string]: string }) => {
      const event = `data: ${JSON.stringify(data)}\n\n`
      res.write(event)
    }

    changeStream.on('change', (change) => {
      const documentId = change.documentKey._id.toString() // Convert ObjectId to string
      const updatedFields = change.updateDescription.updatedFields.invitations[0].toString()
      console.log('Received document ID:', documentId)
      //console.log('Received user ID:', userId)
      console.log('Received updated fields:', updatedFields)

      if (documentId === '6511f666b6c69c563580fc56') {
        sendUpdate(updatedFields)
      }
    })

    req.socket.on('close', () => {
      clearInterval(intervalId)
      res.end()
    })
  } else {
    res.status(404).end()
  }
}
