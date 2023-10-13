import React from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'

interface Player {
  name: string
  wins: number
  tie: number
  loss: number
  games: number
  points: number
}

interface Props {
  combinedPlayers: Player[]
}

const getPositionByPoints = (player: Player, array: Player[]) => {
  const sortedArray = [...array].sort((a, b) => b.points - a.points)
  return sortedArray.findIndex((item) => item.name === player.name) + 1
}

const PlayerTable: React.FC<Props> = ({ combinedPlayers }) => {
  return (
    <Table aria-label="Example static collection table">
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
        {combinedPlayers.map((player, index) => (
          <TableRow
            key={player.name + '-' + index}
            className={`table-row ${index === 2 ? 'third-row' : ''}`}
          >
            <TableCell
              className={
                index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''
              }
            >
              {getPositionByPoints(player, combinedPlayers)}
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
