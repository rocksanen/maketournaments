'use client'
import React, { useState } from 'react'
import { Select, SelectItem, Card, Button, Tooltip } from '@nextui-org/react'
import { User } from '@/types/User'
import MatchPlayers from '@/components/tournamentEditor/challengePlayer/match'

interface SelectWrapperProps {
  acceptedPlayers: User[]
}

const SelectWrapper: React.FC<SelectWrapperProps> = ({ acceptedPlayers }) => {
  const [selectedLeftId, setSelectedLeftId] = useState<string | undefined>(undefined)
  const [selectedRightId, setSelectedRightId] = useState<string | undefined>(undefined)
  const [matchedPlayers, setMatchedPlayers] = useState<User[][]>([])

  const matchedPlayerIds = matchedPlayers.flat().map((player) => player.id)

  const leftAvailablePlayers = acceptedPlayers.filter(
    (player) => !matchedPlayerIds.includes(player.id) && player.id !== selectedRightId,
  )

  const rightAvailablePlayers = acceptedPlayers.filter(
    (player) => !matchedPlayerIds.includes(player.id) && player.id !== selectedLeftId,
  )

  const arePlayersNotSelected = !selectedLeftId || !selectedRightId

  const handleConfirmClick = () => {
    const leftPlayerMatch = acceptedPlayers.find((player) => player.id === selectedLeftId)
    const rightPlayerMatch = acceptedPlayers.find((player) => player.id === selectedRightId)

    if (leftPlayerMatch && rightPlayerMatch) {
      setMatchedPlayers((prev) => [...prev, [leftPlayerMatch, rightPlayerMatch]])

      // Update state based on whether the matched players are still available
      if (!leftAvailablePlayers.some((player) => player.id === leftPlayerMatch.id)) {
        setSelectedLeftId(undefined)
      }

      if (!rightAvailablePlayers.some((player) => player.id === rightPlayerMatch.id)) {
        setSelectedRightId(undefined)
      }
    }
  }

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Card className="w-full">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Select
              label="Select a player 1"
              className="max-w-xs"
              value={selectedLeftId || undefined}
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
              value={selectedRightId || undefined}
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
              <Button className="mt-0 h-auto" onClick={handleConfirmClick}>
                Confirm
              </Button>
            )}
          </div>
        </Card>
      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        {matchedPlayers.map((playersPair, idx) => (
          <MatchPlayers key={idx} matchPlayers={playersPair} />
        ))}
      </div>
    </>
  )
}

export default SelectWrapper
