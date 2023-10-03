import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { FC } from 'react'
import React from 'react'
import { columns } from './data'
import { RenderCell } from './render-cell'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'

const GET_TOURNAMENTS_BY_USER = gql`
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

interface TableWrapperProps {
  count?: number // Add a prop to receive the count
}

export const TableWrapper: FC<TableWrapperProps> = ({ count = Infinity }) => {
  const session = useSession() // Just get the session without destructuring
  const userId = session.data?.user?.id ?? null // Safely access user id

  const { loading, error, data } = useQuery(GET_TOURNAMENTS_BY_USER, {
    variables: { userId },
    skip: !userId,
  })

  if (session.status === 'loading') return <p>Loading...</p> // Check loading status here
  if (!userId) return <p>Not Logged In</p>
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const tournaments = data?.tournamentsByUser.slice(0, count) ?? []

  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tournaments.map((tournament, index) => ({ key: index, ...tournament }))}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  <RenderCell tournament={item} columnKey={columnKey} userId={userId} />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
