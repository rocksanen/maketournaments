import React from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { Community } from '../icons/community' // Check this import as well

interface Player {
  id: string
}

interface Match {
  winner: Player | null
}

interface Tournament {
  matches: Match[]
  players: Player[]
}

interface GetUserStatsResponse {
  tournamentsByUser: Tournament[]
}

const GET_USER_STATS = gql`
  query Query($userId: ID!) {
    tournamentsByUser(userId: $userId) {
      matches {
        winner {
          id
        }
      }
      players {
        id
      }
    }
  }
`

export const CardBalance1: React.FC = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null

  const { loading, error, data } = useQuery<GetUserStatsResponse>(GET_USER_STATS, {
    variables: { userId },
    skip: !userId,
  })

  let content

  if (loading) {
    content = <span className="text-white">Loading...</span>
  } else if (error || !session || !userId || !data) {
    content = <span className="text-white">Error or not logged in</span>
  } else {
    let gamesPlayed = 0
    let gamesWon = 0

    data.tournamentsByUser.forEach((tournament) => {
      const validMatches = tournament.matches.filter((match) => match.winner?.id)

      if (tournament.players.some((player) => player.id === userId)) {
        gamesPlayed += validMatches.length
        gamesWon += validMatches.filter((match) => match.winner!.id === userId).length
      }
    })

    const winRate = gamesPlayed === 0 ? 0 : ((gamesWon / gamesPlayed) * 100).toFixed(2)

    content = (
      <>
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-white">Overall win percentage</span>
            <span className="text-white text-xs">{gamesPlayed} Games</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-xl font-semibold">{gamesWon} Games won</span>
          <span className="text-success text-xs">{winRate}%</span>
        </div>
      </>
    )
  }

  return (
    <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">{content}</CardBody>
    </Card>
  )
}

export default CardBalance1
