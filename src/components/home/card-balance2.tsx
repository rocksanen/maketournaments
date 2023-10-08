import React from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery, gql } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { Community } from '../icons/community'
import { parseDate } from '../../utils/dateParse'

// GraphQL query
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

// Types for GraphQL response
interface Admin {
  id: string
}

interface Tournament {
  admin: Admin[]
  date: string
}

interface QueryData {
  tournamentsByUser: Tournament[]
}

export const CardBalance2: React.FC = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null

  // Fetching data
  const { loading, error, data } = useQuery<QueryData>(GET_USER_TOURNAMENTS, {
    variables: { userId },
    skip: !userId,
  })

  let content

  if (loading || !session) {
    content = <span className="text-default-900">Loading...</span>
  } else if (error) {
    content = <span className="text-default-900">Error: {error.message}</span>
  } else if (!userId || !data) {
    content = <span className="text-default-900">Not Logged In</span>
  } else {
    // Filtering ongoing tournaments
    const ongoingTournaments = data.tournamentsByUser.filter((tournament) => {
      const tournamentDate = parseDate(tournament.date)
      const currentDate = new Date()

      return tournament.admin.some((admin) => admin.id === userId) && tournamentDate > currentDate
    }).length

    // Rendering content
    content = (
      <>
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-default-900">Tournaments Admining</span>
            <span className="text-default-900 text-xs">{ongoingTournaments} Tournaments</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-default-900 text-xl font-semibold">{ongoingTournaments}</span>
        </div>
      </>
    )
  }

  // Rendering the card
  return (
    <Card className="xl:max-w-sm bg-default-50 rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">{content}</CardBody>
    </Card>
  )
}
