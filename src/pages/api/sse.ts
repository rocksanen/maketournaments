import { NextApiRequest, NextApiResponse } from 'next'
import { changeStream } from '../../lib/mongoChangeStream'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.accept && req.headers.accept === 'text/event-stream') {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const HEARTBEAT_INTERVAL = 5000
    const intervalId = setInterval(() => {
      // Send a heartbeat message to keep the connection alive
      res.write(': heartbeat\n\n')
    }, HEARTBEAT_INTERVAL)
    const sendUpdate = (data: { [key: string]: string }) => {
      const event = `data: ${JSON.stringify(data)}\n\n`

      res.write(event)
    }
    changeStream.on('change', (change) => {
      // Notify the client about the change

      sendUpdate(change)
    })
    req.socket.on('close', () => {
      // Clean up resources and stop sending updates when the client disconnects

      clearInterval(intervalId)

      res.end()
    })
  } else {
    // Return a 404 response for non-SSE requests
    res.status(404).end()
  }
}
