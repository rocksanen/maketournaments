'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react'
import { ExportIcon } from '@/components/icons/accounts/export-icon'
import { Input } from '@nextui-org/react'
import { TableWrapper } from '@/components/invitePlayers/invitationTable'
import { Dropdown, DropdownItem } from '@nextui-org/react'
import { gql, useMutation } from '@apollo/client'

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

const SEND_INVITATION = gql`
  mutation SendInvitation($tournamentId: ID!, $email: String!) {
    sendInvitation(tournamentId: $tournamentId, email: $email) {
      success
      message
    }
  }
`

export default function EditTournament() {
  const router = useRouter()
  const { id, name } = router.query
  const [email, setEmail] = useState('')
  const [sendInvitation] = useMutation(SEND_INVITATION)
  //6512c6ba2f5af2aece86cea4
  //6512c6352f5af2aece86ce9e
  //65128e9124cd2da4a35fc602
  //6512843524cd2da4a35fc5f9
  //6512832a24cd2da4a35fc5ef
  //6512807e24cd2da4a35fc5e7
  const handleSendInvitation = async () => {
    try {
      const response = await sendInvitation({
        variables: {
          tournamentId: '6512c76c2f5af2aece86ceab', // this is a tournament id for tournament called kikkeli
          email,
        },
      })

      const { success, message } = response.data.sendInvitation

      if (success) {
        alert('Invitation sent successfully!')
      } else {
        alert(`Error sending invitation: ${message}`)
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Error sending invitation. Please try again later.')
    }
  }

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
            <TableRow key={index} className={`table-row ${index === 2 ? 'third-row' : ''}`}>
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
      <div className="export-csv">
        <Button color="primary" startContent={<ExportIcon />}>
          Export to CSV
        </Button>
      </div>
      <Card className="w-full h-1/4 flex flex-col gap-1 items-start justify-center">
        <CardHeader className="flex items-center justify-between w-full">
          <Input
            type="text"
            label="Invite player"
            placeholder="Enter email address"
            className="w-full"
            labelPlacement="outside-left"
            style={{ marginRight: '1rem' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Dropdown placeholder="Select role" className="w-1/4">
            <DropdownItem value="player">Player</DropdownItem>
            <DropdownItem value="admin">Admin</DropdownItem>
          </Dropdown>
          <Button color="primary" className="w-20 h-full" onClick={handleSendInvitation}>
            Send
          </Button>
        </CardHeader>
      </Card>
      <TableWrapper />
    </div>
  )
}
