import { Avatar, Card, CardBody } from '@nextui-org/react'
import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'

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

const StatusMessage: React.FC<{ message: string }> = ({ message }) => (
  <Card className="bg-default-50 rounded-xl shadow-md px-3">
    <CardBody className="py-5 gap-4">
      <div className="flex gap-2.5 justify-center">
        <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
          <span className="text-default-900 text-xl font-semibold">Status</span>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <span className="text-default-900 font-semibold">{message}</span>
      </div>
    </CardBody>
  </Card>
)

export const CardTransactions: React.FC = () => {
  const { data: sessionData } = useSession()
  const userId = sessionData?.user?.id

  const { data, loading, error } = useQuery(TOURNAMENTS_BY_USER, {
    variables: { userId },
    skip: !userId,
  })

  if (!userId) return <StatusMessage message="Not logged in" />
  if (loading) return <StatusMessage message="Loading..." />
  if (error) return <StatusMessage message={`Error: ${error.message}`} />

  const tournaments = data.tournamentsByUser
    .filter((tournament: any) => {
      return tournament.players.some((player: any) => player.id === userId)
    })
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  if (tournaments.length === 0) return <StatusMessage message="No tournaments found" />

  return (
    <Card className="bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">Latest Tournaments</span>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {tournaments.map((tournament: any, index: number) => (
            <div key={`${tournament.name}-${index}`} className="grid grid-cols-4 w-full">
              <div className="w-full">
                <Avatar
                  isBordered
                  color="secondary"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d" // Placeholder, replace with actual image URL or logic
                />
              </div>
              <span className="text-default-900 font-semibold">{tournament.name}</span>
              <div>
                <span className="text-success text-xs">
                  {tournament.matches.filter((match: any) => match.winner.id === userId).length}
                </span>
              </div>
              <div>
                <span className="text-default-500 text-xs">
                  {new Date(Number(tournament.date)).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
