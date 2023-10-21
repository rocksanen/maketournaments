import MatchPlayers from '@/components/tournamentEditor/challengePlayer/match'
import { User } from '@/types/User'
import { Button, Select, SelectItem, Tooltip } from '@nextui-org/react'
import React, { useEffect, useMemo, useState } from 'react'

interface SelectWrapperProps {
  acceptedPlayers: User[]
  tournamentId: string
  setResult: React.Dispatch<
    React.SetStateAction<{
      player1_id: string | null
      player2_id: string | null
      resultType: 'player-1' | 'player-2' | 'tie'
    } | null>
  >
}

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  acceptedPlayers,
  tournamentId,
  setResult,
}) => {
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

  useEffect(() => {
    const localStorageKey = `tournament_${tournamentId}_matchedPlayers`
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedMatchedPlayers = localStorage.getItem(localStorageKey)
      if (storedMatchedPlayers) {
        setMatchedPlayers(JSON.parse(storedMatchedPlayers))
      }
    }
  }, [tournamentId])

  const matchedPlayerIds = useMemo(
    () => matchedPlayers.flat().map((player) => player.id),
    [matchedPlayers],
  )

  const leftAvailablePlayers = useMemo(
    () =>
      acceptedPlayers.filter(
        (player) => !matchedPlayerIds.includes(player.id) && player.id !== selectedRightId,
      ),
    [acceptedPlayers, matchedPlayerIds, selectedRightId],
  )

  const rightAvailablePlayers = useMemo(
    () =>
      acceptedPlayers.filter(
        (player) => !matchedPlayerIds.includes(player.id) && player.id !== selectedLeftId,
      ),
    [acceptedPlayers, matchedPlayerIds, selectedLeftId],
  )

  const arePlayersNotSelected = !selectedLeftId || !selectedRightId

  const handleConfirmClick = () => {
    const leftPlayerMatch = acceptedPlayers.find((player) => player.id === selectedLeftId)
    const rightPlayerMatch = acceptedPlayers.find((player) => player.id === selectedRightId)

    if (leftPlayerMatch && rightPlayerMatch) {
      setMatchedPlayers((prev) => {
        const updated = [...prev, [leftPlayerMatch, rightPlayerMatch]]
        if (typeof window !== 'undefined' && window.localStorage) {
          const localStorageKey = `tournament_${tournamentId}_matchedPlayers`
          localStorage.setItem(localStorageKey, JSON.stringify(updated))
        }
        return updated
      })
      setSelectedLeftId(undefined)
      setSelectedRightId(undefined)
    }
  }

  const handleMatchEnd = (result: {
    player1_id: string
    player2_id: string
    resultType: 'player-1' | 'player-2' | 'tie'
  }) => {
    const { player1_id, player2_id, resultType } = result

    setMatchedPlayers((prev) => {
      const updated = prev.filter((pair) => pair[0].id !== player1_id && pair[1].id !== player2_id)
      if (typeof window !== 'undefined' && window.localStorage) {
        const localStorageKey = `tournament_${tournamentId}_matchedPlayers`
        localStorage.setItem(localStorageKey, JSON.stringify(updated))
      }
      return updated
    })

    console.log(result, 'result in playerSelect')
    setResult(result)
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
          <MatchPlayers
            key={idx}
            matchPlayers={playersPair}
            onEnd={handleMatchEnd} // Passing a handler for when a match ends
          />
        ))}
      </div>
    </>
  )
}

export default SelectWrapper
