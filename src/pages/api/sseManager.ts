import { NextApiResponse } from 'next'

type SSEConnections = Map<string, NextApiResponse>

const connections: SSEConnections = new Map()

export function addSSEConnection(userId: string, res: NextApiResponse) {
  connections.set(userId, res)
}

export function removeSSEConnection(userId: string) {
  connections.delete(userId)
}

export function sendUpdate(userId: string, data: { [key: string]: string }) {
  const res = connections.get(userId)
  if (res) {
    const event = `data: ${JSON.stringify(data)}\n\n`
    res.write(event)
    console.log('Sent SSE update:', data)
  }
}
