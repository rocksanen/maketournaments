import React from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'

// Double-check this path and export
import { Community } from '../icons/community'

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

export const CardBalance1 = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null

  const { loading, error, data } = useQuery(GET_USER_STATS, {
    variables: { userId },
    skip: !userId,
  })

  let content

  if (loading) {
    content = <span className="text-white">Loading...</span>
  } else if (!session) {
    content = <span className="text-white">Not Logged In</span>
  } else if (error) {
    content = <span className="text-white">Error: {error.message}</span>
  } else if (!userId) {
    content = <span className="text-white">Not Logged In</span>
  } else {
    let gamesPlayed = 0
    let gamesWon = 0

    data.tournamentsByUser.forEach((tournament) => {
      if (tournament.players.some((player) => player.id === userId)) {
        gamesPlayed += tournament.matches.length
        gamesWon += tournament.matches.filter((match) => match.winner.id === userId).length
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
    // Make sure Card and CardBody are correctly imported from '@nextui-org/react'
    <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">{content}</CardBody>
    </Card>
  )
}
