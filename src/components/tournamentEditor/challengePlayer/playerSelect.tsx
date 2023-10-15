import MatchPlayers from '@/components/tournamentEditor/challengePlayer/match'
import { User } from '@/types/User'
import { Button, Select, SelectItem, Tooltip } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

interface SelectWrapperProps {
  acceptedPlayers: User[]
  tournamentId: string
}

const SelectWrapper: React.FC<SelectWrapperProps> = ({ acceptedPlayers, tournamentId }) => {
  const [selectedLeftId, setSelectedLeftId] = useState<string | undefined>(undefined)
  const [selectedRightId, setSelectedRightId] = useState<string | undefined>(undefined)
  const [matchedPlayers, setMatchedPlayers] = useState<User[][]>(() => {
    const localStorageKey = `tournament_${tournamentId}_matchedPlayers`
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedMatchedPlayers = localStorage.getItem(localStorageKey)
      return storedMatchedPlayers ? JSON.parse(storedMatchedPlayers) : []
    } else {
      return []
    }
  })
  const matchedPlayerIds = matchedPlayers.flat().map((player) => player.id)

  useEffect(() => {}, [selectedLeftId, selectedRightId])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageKey = `tournament_${tournamentId}_matchedPlayers`
      const storedMatchedPlayers = localStorage.getItem(localStorageKey)
      if (storedMatchedPlayers) {
        setMatchedPlayers(JSON.parse(storedMatchedPlayers))
      }
    }
  }, [tournamentId])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const localStorageKey = `tournament_${tournamentId}_matchedPlayers`
      localStorage.setItem(localStorageKey, JSON.stringify(matchedPlayers))
    }
  }, [matchedPlayers, tournamentId])

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
      setSelectedLeftId(undefined)
      setSelectedRightId(undefined)
    }
  }

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 ">
        <div className="ml-2 flex w-full flex-wrap md:flex-nowrap gap-4">
          <Select
            label="Select a player 1"
            className="w-1/5"
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
            className="w-1/5"
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
      </div>
      <div className="blue-line"></div>
      <div className="flex flex-col w-full gap-4">
        {matchedPlayers.map((playersPair, idx) => (
          <MatchPlayers key={idx} matchPlayers={playersPair} />
        ))}
      </div>
    </>
  )
}

export default SelectWrapper
