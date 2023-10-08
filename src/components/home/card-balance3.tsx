import React from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { Community } from '../icons/community'
import { parseDate } from '../../utils/dateParse'

// GraphQL query
const GET_UPCOMING_MATCHES = gql`
  query TournamentsByUser($userId: ID!) {
    tournamentsByUser(userId: $userId) {
      matches {
        startTime
        players {
          id
        }
      }
    }
  }
`

// Types
interface Player {
  id: string
}

interface Match {
  startTime: string
  players: Player[]
}

interface Tournament {
  matches: Match[]
}

interface QueryData {
  tournamentsByUser: Tournament[]
}

export const CardBalance3: React.FC = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null

  const { loading, error, data } = useQuery<QueryData>(GET_UPCOMING_MATCHES, {
    variables: { userId },
    skip: !userId,
  })

  let content

  if (loading || !session) {
    content = <span className="text-white">Loading...</span>
  } else if (error) {
    content = <span className="text-white">Error: {error.message}</span>
  } else if (!userId || !data) {
    content = <span className="text-white">Not Logged In</span>
  } else {
    const upcomingMatches = data.tournamentsByUser
      .flatMap((tournament) => tournament.matches)
      .filter((match) => {
        const matchStartTime = parseDate(match.startTime)
        const currentDate = new Date()

        return matchStartTime > currentDate && match.players.some((player) => player.id === userId)
      }).length

    content = (
      <>
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-white">Upcoming Matches</span>
            <span className="text-white text-xs">{upcomingMatches} Matches</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-xl font-semibold">{upcomingMatches}</span>
        </div>
      </>
    )
  }

  return (
    <Card className="xl:max-w-sm bg-success rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">{content}</CardBody>
    </Card>
  )
}
