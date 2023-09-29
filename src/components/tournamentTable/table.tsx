import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import React from 'react'
import { columns } from './data'
import { RenderCell } from './render-cell'
import { useQuery, gql } from '@apollo/client';

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
    }
  }
`

export const TableWrapper = () => {
  const userId = '6511f666b6c69c563580fc56' // Static user ID

  const { loading, error, data } = useQuery(GET_TOURNAMENTS_BY_USER, {
    variables: { userId },
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const tournaments = data.tournamentsByUser // Adjust based on the actual data structure

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
