import { NextApiRequest, NextApiResponse } from 'next'
import { changeStream } from '@/lib/mongoChangeStream'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (!userId) {
    res.status(400).end('User ID not provided')
    return
  }

  if (req.headers.accept && req.headers.accept === 'text/event-stream') {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const HEARTBEAT_INTERVAL = 5000
    const intervalId = setInterval(() => {
      res.write(': heartbeat\n\n')
    }, HEARTBEAT_INTERVAL)

    const sendUpdate = (data: { [key: string]: string }) => {
      const event = `data: ${JSON.stringify({ ...data, userId })}\n\n`
      res.write(event)
      console.log('Sent SSE update:', data)
    }

    changeStream.on('change', (change) => {
      if (change.documentKey._id === userId) {
        sendUpdate(change)
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
