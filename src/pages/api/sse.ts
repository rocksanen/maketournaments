import { NextApiRequest, NextApiResponse } from 'next'
import { changeStream } from '@/lib/mongoChangeStream'

let userId: string

export const setupUserId = (id: string) => {
  userId = id
  console.log(userId, 'Setting up user id in sse.ts')
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

    const sendUpdate = () => {
      res.write('data: update\n\n')
      console.log('Sent SSE update')
    }

    changeStream.on('change', (change) => {
      const documentKeyString = JSON.stringify(change.documentKey)
      const documentKey = JSON.parse(documentKeyString)
      const documentId = documentKey._id
      console.log(documentId, ' in sse is equal to ', userId)
      if (documentId === userId) {
        sendUpdate()
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
