import React from 'react'
import { Ruleset } from '@/types/Ruleset'
import { Tournament } from '@/types/Tournament'
import { Card, CardBody, Button } from '@nextui-org/react'
import { UPDATE_TOURNAMENT_ADD_PLAYER } from '@/graphql/clientQueries/tournamentOperations'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { REMOVE_TOURNAMENT_INVITATION } from '@/graphql/clientQueries/userOperations'

interface TournamentDetailsProps {
  tournament: Tournament
  ruleset: Ruleset | null
  onDecline: () => void
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({
  tournament,
  ruleset,
  onDecline,
}) => {
  const currentDate = new Date()
  const tournamentDate = new Date(Number(tournament.date))
  const isTournamentFinished = currentDate > tournamentDate
  const [updateTournamentAddPlayer] = useMutation(UPDATE_TOURNAMENT_ADD_PLAYER)
  const [removeTournamentInvitation] = useMutation(REMOVE_TOURNAMENT_INVITATION)
  const router = useRouter()
  const { data: session } = useSession()

  const handleAccept = async () => {
    console.log('User ID from session:', session?.user?.id)

    try {
      // Update the tournament to add the player
      console.log('meni yksi')
      const updateResponse = await updateTournamentAddPlayer({
        variables: {
          tournamentId: tournament.id,
          playerId: session?.user?.id,
        },
      })
      console.log('meni kaksi')
      console.log('Update tournament response:', updateResponse)

      // If updating the tournament is successful, then try to remove the invitation
      if (updateResponse.data && updateResponse.data.updateTournamentPlayers) {
        // NOTE: Replace "someFieldName" with the appropriate field from your GraphQL response
        const removeResponse = await removeTournamentInvitation({
          variables: {
            userId: session?.user?.id,
            tournamentId: tournament.id,
          },
        })

        console.log('Remove invitation response:', removeResponse)

        if (removeResponse.data && !removeResponse.data.removeTournamentInvitation.success) {
          // NOTE: Replace "someOtherFieldName" with the appropriate field from your GraphQL response
          console.error('Failed to remove invitation from user:', removeResponse.errors)
        }
      } else {
        console.error('Failed to add player to tournament:', updateResponse.errors)
      }

      router.push('/accounts')
    } catch (error) {
      console.error('Error during the accept operation:', error)
    }
  }
  return (
    <Card>
      <CardBody>
        <h3>{tournament.name}</h3>
        <p>Tournament ID: {tournament.id}</p>
        <p>Date: {new Date(Number(tournament.date)).toDateString()}</p>
        <p>Players: {tournament.maxPlayers}</p>
        {tournament.description && (
          <p>
            Description:{' '}
            {tournament.description ? tournament.description : 'No description provided.'}
          </p>
        )}
        {ruleset && (
          <>
            <p>Rules Name: {ruleset.name}</p>
            <p>Rounds: {ruleset.rounds}</p>
            <p>Winner Points: {ruleset.winnerpoints}</p>
            <p>Loser Points: {ruleset.loserpoints}</p>
            <p>Draw Points: {ruleset.drawpoints}</p>
            <p>NightmarePointsOn: {ruleset.nightmarePointsOn ? 'Yes' : 'No'}</p>
            <p>NightmarePoints: {ruleset.nightmarepoints}</p>
          </>
        )}
        <div className="flex justify-end gap-4 mt-4">
          {isTournamentFinished ? (
            <p>Tournament has expired.</p>
          ) : (
            <Button color="primary" onClick={handleAccept}>
              Accept
            </Button>
          )}
          <Button color="danger" onClick={onDecline}>
            Decline
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default TournamentDetails
