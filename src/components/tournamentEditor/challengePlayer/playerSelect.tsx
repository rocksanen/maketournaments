'use client'
import React, { useState } from 'react'
import { Select, SelectItem, Card, Button, Tooltip } from '@nextui-org/react'
import { User } from '@/types/User'

interface SelectWrapperProps {
  acceptedPlayers: User[]
}

const SelectWrapper: React.FC<SelectWrapperProps> = ({ acceptedPlayers }) => {
  const [selectedLeftId, setSelectedLeftId] = useState<string | undefined>(undefined)
  const [selectedRightId, setSelectedRightId] = useState<string | undefined>(undefined)

  // Players available for the left dropdown (excluding the one selected in the right dropdown)
  const leftAvailablePlayers = selectedRightId
    ? acceptedPlayers.filter((player) => player.id !== selectedRightId)
    : acceptedPlayers

  // Players available for the right dropdown (excluding the one selected in the left dropdown)
  const rightAvailablePlayers = selectedLeftId
    ? acceptedPlayers.filter((player) => player.id !== selectedLeftId)
    : acceptedPlayers

  // Check if neither players are selected
  const arePlayersNotSelected = !selectedLeftId || !selectedRightId

  return (
    <Card className="w-full">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Select
          label="Select a player 1"
          className="max-w-xs"
          value={selectedLeftId}
          onChange={(e) => setSelectedLeftId(e.target.value)}
        >
          {leftAvailablePlayers.map((player) => (
            <SelectItem key={player.id} value={player.id}>
              {player.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Select a player 2"
          placeholder=""
          className="max-w-xs"
          value={selectedRightId}
          onChange={(e) => setSelectedRightId(e.target.value)}
        >
          {rightAvailablePlayers.map((player) => (
            <SelectItem key={player.id} value={player.id}>
              {player.name}
            </SelectItem>
          ))}
        </Select>

        {arePlayersNotSelected ? (
          <Tooltip content="Please select both players!">
            <Button className="mt-0 h-auto" disabled>
              Confirm
            </Button>
          </Tooltip>
        ) : (
          <Button className="mt-0 h-auto">Confirm</Button>
        )}
      </div>
    </Card>
  )
}

export default SelectWrapper
