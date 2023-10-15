import TournamentDetails from '@/components/invitations/tournamentDetail'
import { GET_RULESET_BY_ID } from '@/graphql/clientQueries/rulesetOperations'
import { GET_TOURNAMENT_BY_ID } from '@/graphql/clientQueries/tournamentOperations'
import {
  GET_ADMINS_BY_ID,
  GET_USER_INVITATIONS_BY_ID,
} from '@/graphql/clientQueries/userOperations'
import { Ruleset } from '@/types/Ruleset'
import { Tournament } from '@/types/Tournament'
import { User } from '@/types/User'
import { useQuery } from '@apollo/client'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { columns } from '../../components/invitations/invitationColumns'
import { RenderCell } from '../../components/invitations/renderInvitationCell'

const InvitationsComponent = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id || ''

  const [tournamentIds, setTournamentIds] = useState([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [adminNames, setAdminNames] = useState<{ [key: string]: string }>({})
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [selectedRuleset, setSelectedRuleset] = useState<Ruleset | null>(null)

  const { data: userData } = useQuery(GET_USER_INVITATIONS_BY_ID, {
    variables: { id: userId },
    skip: !userId,
  })

  useEffect(() => {
    if (userData?.user?.invitations) {
      setTournamentIds(userData.user.invitations)
    }
  }, [userData])

  const { data: tournamentData } = useQuery(GET_TOURNAMENT_BY_ID, {
    variables: { ids: tournamentIds },
    skip: !tournamentIds.length,
  })

  useEffect(() => {
    if (tournamentData?.getTournamentsByIds) {
      setTournaments(tournamentData.getTournamentsByIds)
      console.log(tournamentData.getTournamentsByIds)
    }
  }, [tournamentData])

  const { data: rulesetData, loading: rulesetLoading } = useQuery(GET_RULESET_BY_ID, {
    variables: { id: selectedTournament?.ruleset[0].id },
    skip: !selectedTournament,
  })

  useEffect(() => {
    if (rulesetData?.ruleset) {
      setSelectedRuleset(rulesetData.ruleset)
    }
  }, [rulesetData])

  const adminIds = tournaments.map((tournament) => tournament.admin[0].id)

  const { data: adminsData } = useQuery<{ getUsersByIds: User[] }>(GET_ADMINS_BY_ID, {
    variables: { ids: adminIds },
    skip: !tournaments.length,
  })

  useEffect(() => {
    if (adminsData?.getUsersByIds) {
      const newAdminNames: { [key: string]: string } = adminsData.getUsersByIds.reduce(
        (acc: { [key: string]: string }, admin: User) => {
          acc[admin.id.toString()] = admin.name
          return acc
        },
        {},
      )
      setAdminNames(newAdminNames)
    }
  }, [adminsData])

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
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    tournament={item}
                    columnKey={columnKey}
                    adminName={adminNames[item.admin[0].id.toString()]}
                    setSelectedTournament={setSelectedTournament} // Passing the state setter
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedTournament && (
        <TournamentDetails
          tournament={selectedTournament}
          ruleset={selectedRuleset}
          onDecline={() => setSelectedTournament(null)}
        />
      )}
    </div>
  )
}

export default InvitationsComponent
