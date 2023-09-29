import { NextApiRequest, NextApiResponse } from 'next'
import { newInvitationEmitter } from '@/lib/mongoChangeStream'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.accept && req.headers.accept === 'text/event-stream') {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const HEARTBEAT_INTERVAL = 5000
    const intervalId = setInterval(() => {
      res.write(': heartbeat\n\n')
    }, HEARTBEAT_INTERVAL)

    const sendUpdateSignal = () => {
      const event = 'update\n\n'
      res.write(event)
    }

    newInvitationEmitter.on('update', () => {
      sendUpdateSignal()
    })

    req.socket.on('close', () => {
      clearInterval(intervalId)
      newInvitationEmitter.removeAllListeners('update') // Remove event listeners on connection close
      res.end()
    })
  } else {
    res.status(404).end()
  }
}
