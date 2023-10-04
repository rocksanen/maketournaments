// invitations table to accept or decline a tournament invitation
// get invitations from user using gql query like for example in tournamentTable/table.tsx
//
/*
example query: const GET_TOURNAMENTS_BY_USER = gql`
  query GetTournamentsByUser($userId: ID!) {
    tournamentsByUser(userId: $userId) {
      admin {
        id
      }
      players {
        id
      }
      name
      date
      id
    }
  }
`
*/

import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react'
import { Input } from '@nextui-org/react'
import { Dropdown, DropdownItem } from '@nextui-org/react'
import { TableWrapper } from '@/components/invitePlayers/invitationTable'
import { ExportIcon } from '@/components/icons/accounts/export-icon'

const GET_INVITATIONS_BY_USER = gql`
  query GetInvitationsByUser($userId: ID!) {
    invitationsByUser(userId: $userId) {
      admin {
        id
      }
      players {
        id
      }
      name
      date
      id
    }
  }
`

const invitations = () => {
  const router = useRouter()
  const session = useSession()
  const userId = session.data?.user?.id ?? null

  const { loading, error, data } = useQuery(GET_INVITATIONS_BY_USER, {
    variables: { userId },
    skip: !userId,
  })

  const [acceptInvitation] = useMutation(ACCEPT_INVITATION)
  const [declineInvitation] = useMutation(DECLINE_INVITATION)

  if (session.status === 'loading') return <p>Loading...</p>
  if (!userId) return <p>Not Logged In</p>
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const invitations = data?.invitationsByUser ?? []

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Invitations</h1>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <h4 className="text-2xl font-bold">Invitations</h4>
            </CardHeader>
            <CardBody>
              <TableWrapper>
                <Table aria-label="Example table with custom cells">
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn
                        key={column.uid}
                        align={column.uid === 'actions' ? 'center' : 'start'}
                      >
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={invitations.map((invitation, index) => ({ key: index, ...invitation }))}
                  >
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => (
                          <TableCell>
                            <RenderCell invitation={item} columnKey={columnKey} userId={userId} />
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableWrapper>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  )
}

const columns = [
  { uid: 'name', name: 'Name' },
  { uid: 'date', name: 'Date' },
  { uid: 'actions', name: 'Actions' },
]
