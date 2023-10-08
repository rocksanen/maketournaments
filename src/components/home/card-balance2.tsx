import { Card, CardBody } from '@nextui-org/react'
import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { Community } from '../icons/community'

const GET_USER_TOURNAMENTS = gql`
  query TournamentsByUser($userId: ID!) {
    tournamentsByUser(userId: $userId) {
      admin {
        id
      }
      date
    }
  }
`

export const CardBalance2 = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null

  const { loading, error, data } = useQuery(GET_USER_TOURNAMENTS, {
    variables: { userId },
    skip: !userId,
  })

  let content

  if (loading || !session) {
    content = <span className="text-default-900">Loading...</span>
  } else if (error) {
    content = <span className="text-default-900">Error: {error.message}</span>
  } else if (!userId) {
    content = <span className="text-default-900">Not Logged In</span>
  } else {
    const ongoingTournaments = data.tournamentsByUser.filter(
      (tournament) => tournament.admin.id === userId && new Date(tournament.date) > new Date(),
    ).length

    content = (
      <>
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-default-900">Tournaments Administered</span>
            <span className="text-default-900 text-xs">{ongoingTournaments} Tournaments</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-default-900 text-xl font-semibold">{ongoingTournaments}</span>
        </div>
      </>
    )
  }

  return (
    <Card className="xl:max-w-sm bg-default-50 rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">{content}</CardBody>
    </Card>
  )
}
