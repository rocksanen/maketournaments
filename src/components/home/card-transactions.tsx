import React from 'react'
import { Card, CardBody, Avatar } from '@nextui-org/react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { parseDate } from '../../utils/dateParse' // Make sure the path is correct

interface Player {
  id: string
}

interface Match {
  winner: Player | null
}

interface Tournament {
  matches: Match[]
  date: string
  name: string
  players: Player[]
}

interface TournamentsByUserResponse {
  tournamentsByUser: Tournament[]
}

interface StatusMessageProps {
  message: string
}

const TOURNAMENTS_BY_USER = gql`
  query Query($userId: ID!) {
    tournamentsByUser(userId: $userId) {
      matches {
        winner {
          id
        }
      }
      date
      name
      players {
        id
      }
    }
  }
`

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => (
  <Card className="bg-default-50 rounded-xl shadow-md px-3">
    <CardBody className="py-5 gap-4">
      <div className="flex gap-2.5 justify-center">
        <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
          <span className="text-default-900 text-xl font-semibold">Latest Tournaments</span>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <span className="text-default-900 font-semibold">{message}</span>
      </div>
    </CardBody>
  </Card>
)

const CardTransactions: React.FC = () => {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user?.id

  const { data, loading, error } = useQuery<TournamentsByUserResponse>(TOURNAMENTS_BY_USER, {
    variables: { userId },
    skip: !userId,
  })

  if (!userId) return <StatusMessage message="Not logged in" />
  if (loading) return <StatusMessage message="Loading..." />
  if (error) return <StatusMessage message={`Error: ${error.message}`} />

  const currentDate = new Date()

  const tournaments = data!.tournamentsByUser
    .filter((tournament) => {
      return tournament.players.some((player) => player.id === userId)
    })
    .filter((tournament) => parseDate(tournament.date) <= currentDate)
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
    .slice(0, 5)

  return (
    <Card className="bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">Latest Tournaments</span>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {tournaments.map((tournament, index) => (
            <div key={`${tournament.name}-${index}`} className="grid grid-cols-4 w-full">
              <div className="w-full">
                <Avatar
                  isBordered
                  color="secondary"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
              </div>
              <span className="text-default-900 font-semibold">{tournament.name}</span>
              <div>
                <span className="text-success text-xs">
                  {
                    tournament.matches.filter((match) => match.winner && match.winner.id === userId)
                      .length
                  }
                </span>
              </div>
              <div>
                <span className="text-default-500 text-xs">
                  {parseDate(tournament.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default CardTransactions
