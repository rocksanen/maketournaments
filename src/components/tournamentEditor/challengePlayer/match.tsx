'use client'
import React, { useState } from 'react'
import { Select, SelectItem, Card, Button, Tooltip } from '@nextui-org/react'
import { User } from '@/types/User'

interface matchPlayersProps {
  matchPlayers: User[]
}

const MatchPlayers: React.FC<matchPlayersProps> = ({ matchPlayers }) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Card className="h-14 top-3">
        {matchPlayers[0].name} vs {matchPlayers[1].name}
      </Card>
    </div>
  )
}

export default MatchPlayers
