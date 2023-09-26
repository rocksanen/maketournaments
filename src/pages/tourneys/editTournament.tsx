'use client'
import React from 'react'
import { useRouter } from 'next/router'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react'

const tournamentData = [
  {
    position: '1.',
    name: 'Emil',
    wins: '8',
    tie: '0',
    loss: '1',
    games: '9',
    points: '24',
  },
  {
    position: '2.',
    name: 'Joni',
    wins: '6',
    tie: '1',
    loss: '1',
    games: '8',
    points: '19',
  },
  {
    position: '3.',
    name: 'Eetu',
    wins: '5',
    tie: '0',
    loss: '3',
    games: '8',
    points: '15',
  },
  {
    position: '4.',
    name: 'Otto',
    wins: '4',
    tie: '2',
    loss: '4',
    games: '10',
    points: '14',
  },
  {
    position: '5.',
    name: 'Ilkka',
    wins: '3',
    tie: '3',
    loss: '2',
    games: '8',
    points: '12',
  },
  {
    position: '6.',
    name: 'Simo',
    wins: '3',
    tie: '1',
    loss: '4',
    games: '8',
    points: '10',
  },
  {
    position: '7.',
    name: 'Yrjö',
    wins: '2',
    tie: '0',
    loss: '6',
    games: '8',
    points: '6',
  },
  {
    position: '8.',
    name: 'Surkimus',
    wins: '0',
    tie: '0',
    loss: '8',
    games: '8',
    points: '0',
  },
]

export default function EditTournament() {
  const router = useRouter()
  const { id, name } = router.query
  console.log(id, 'id passing to editTournaments')
  console.log(name, 'name passing to editTournaments')

  return (
    <div className="flex flex-col items-center justify-top w-full h-full">
      <header className="flex flex-col items-center justify-center w-full h-1/6">
        <h1 className="text-4xl font-bold text-white">{name ? name : 'The Great Tournament'}</h1>
      </header>
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
          {tournamentData.map((data, index) => (
            <TableRow key={index} className="table-row">
              <TableCell
                className={
                  index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''
                }
              >
                {data.position}
              </TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.wins}</TableCell>
              <TableCell>{data.tie}</TableCell>
              <TableCell>{data.loss}</TableCell>
              <TableCell>{data.games}</TableCell>
              <TableCell>{data.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
