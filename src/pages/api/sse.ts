import { NextApiRequest, NextApiResponse } from 'next'
import { changeStream } from '@/lib/mongoChangeStream'

let userEmail: string

type ChangeObject = {
  fullDocument: {
    receiverEmail: string
    senderEmail: string
    message: string
    date: string | Date
    isRead: boolean
  }
}

export const setupUserEmail = (email: string) => {
  userEmail = email
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.accept && req.headers.accept === 'text/event-stream') {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const HEARTBEAT_INTERVAL = 5000
    const intervalId = setInterval(() => {
      res.write(': heartbeat\n\n')
    }, HEARTBEAT_INTERVAL)

    const sendUpdate = (change: ChangeObject) => {
      res.write(`data: ${JSON.stringify(change)}\n\n`)
    }

    changeStream.on('change', (change) => {
      const { operationType, fullDocument } = change

      if (operationType === 'insert') {
        const receiverEmail = fullDocument.receiverEmail

        if (receiverEmail === userEmail) {
          sendUpdate(change)
        }
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
