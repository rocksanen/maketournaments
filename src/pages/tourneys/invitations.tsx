import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@apollo/client'
import { GET_TOURNAMENT_BY_ID } from '@/graphql/clientQueries/tournamentOperations'
import { GET_USER_INVITATIONS_BY_ID } from '@/graphql/clientQueries/userOperations'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { RenderCell } from '../../components/invitations/renderInvitationCell'
import { columns } from '../../components/invitations/invitationColumns'

const InvitationsComponent = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id || ''

  const [tournamentIds, setTournamentIds] = useState([])
  const [tournaments, setTournaments] = useState([])

  const { data: userData } = useQuery(GET_USER_INVITATIONS_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  })

  useEffect(() => {
    console.log('userData:', userData)
    if (userData?.user?.invitations) {
      setTournamentIds(userData.user.invitations)
    }
  }, [userData])

  const { data: tournamentData } = useQuery(GET_TOURNAMENT_BY_ID, {
    variables: { ids: tournamentIds },
    skip: !tournamentIds.length,
  })

  useEffect(() => {
    console.log('tournamentData:', tournamentData)
    if (tournamentData?.tournaments) {
      setTournaments(tournamentData.tournaments)
    }
  }, [tournamentData])

  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Tournaments Table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={tournaments.map((tournament, index) =>
            Object.assign({}, tournament, { key: index }),
          )}
        >
          {(item) => (
            <TableRow key={item}>
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

export default InvitationsComponent
