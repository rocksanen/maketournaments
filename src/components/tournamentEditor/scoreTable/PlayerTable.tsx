import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { getPoints } from '@/utils/rulesFunctions'
import React, { useState, useEffect, useRef } from 'react'

interface Player {
  id: string
  name: string
  wins: number
  tie: number
  loss: number
  games: number
  points: number
}

interface Props {
  combinedPlayers: Player[]
  result: {
    player1_id: string | null
    player2_id: string | null
    resultType: 'player-1' | 'player-2' | 'tie'
  } | null
}

const PlayerTable: React.FC<Props> = ({ combinedPlayers: initialPlayers, result }) => {
  const storedPlayersData =
    typeof window !== 'undefined' ? window.localStorage.getItem('playersData') : null
  const [players, setPlayers] = useState<Player[]>(
    storedPlayersData ? JSON.parse(storedPlayersData) : initialPlayers,
  )
  const processedResultRef = useRef(null)
  const points = getPoints()
  console.log('Points from rules:', points)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('playersData', JSON.stringify(players))
    }
  }, [players])

  useEffect(() => {
    setPlayers((prevPlayers) => {
      if (prevPlayers.length === 0 && initialPlayers.length > 0) {
        return initialPlayers
      }
      return prevPlayers
    })
  }, [initialPlayers])

  useEffect(() => {
    let updatedPlayers = [...players]
    if (result && processedResultRef.current !== result) {
      const { player1_id, player2_id, resultType } = result
      const player1Index = updatedPlayers.findIndex((player) => player.id === player1_id)
      const player2Index = updatedPlayers.findIndex((player) => player.id === player2_id)

      if (player1Index !== -1 && isNaN(updatedPlayers[player1Index].points)) {
        updatedPlayers[player1Index].points = 0
      }

      if (player2Index !== -1 && isNaN(updatedPlayers[player2Index].points)) {
        updatedPlayers[player2Index].points = 0
      }

      if (resultType === 'tie') {
        if (player1Index !== -1) {
          updatedPlayers[player1Index].points += points.draw
          console.log('Added draw points to player 1')
        }
        if (player2Index !== -1) {
          updatedPlayers[player2Index].points += points.draw
          console.log('Added draw points to player 2')
        }
      } else if (resultType === 'player-1') {
        if (player1Index !== -1) updatedPlayers[player1Index].points += getPoints().winner
        if (player2Index !== -1) updatedPlayers[player2Index].points += getPoints().loser
      } else if (resultType === 'player-2') {
        if (player1Index !== -1) updatedPlayers[player1Index].points += getPoints().loser
        if (player2Index !== -1) updatedPlayers[player2Index].points += getPoints().winner
      }

      updatedPlayers.sort((a, b) => b.points - a.points)
      console.log('Updated Players:', updatedPlayers)
      setPlayers(updatedPlayers)
    }
    console.log('Received result:', result)
    //eslint-disable-next-line
  }, [result])

  return (
    <Table className="ml-4" aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>POSITION</TableColumn>
        <TableColumn>NAME</TableColumn>
        <TableColumn>WINS</TableColumn>
        <TableColumn>TIE</TableColumn>
        <TableColumn>LOSS</TableColumn>
        <TableColumn>GAMES</TableColumn>
        <TableColumn>POINTS</TableColumn>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow
            key={player.name + '-' + index}
            className={`table-row ${index === 2 ? 'third-row' : ''}`}
          >
            <TableCell
              className={
                index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''
              }
            >
              {index + 1}
            </TableCell>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.wins}</TableCell>
            <TableCell>{player.tie}</TableCell>
            <TableCell>{player.loss}</TableCell>
            <TableCell>{player.games}</TableCell>
            <TableCell>{player.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PlayerTable
