'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@nextui-org/react'
import { ExportIcon } from '@/components/icons/accounts/export-icon'
import { TableWrapper } from '@/components/tournamentEditor/invitePlayers/invitationTable'
import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { User } from '@/types/User'
import { GET_USER_BY_EMAIL } from '@/graphql/clientQueries/userOperations'
import { GET_TOURNAMENT_BY_ID } from '@/graphql/clientQueries/tournamentOperations'
import { GET_RULESET_BY_ID } from '@/graphql/clientQueries/rulesetOperations'
import { SEND_INVITATION } from '@/graphql/clientQueries/invitationOperations'
import { SEND_NOTIFICATION } from '@/graphql/clientQueries/notificationOperations'
import { Tournament } from '@/types/Tournament'
import { Ruleset } from '@/types/Ruleset'
import InvitationCard from '@/components/tournamentEditor/invitePlayers/InvitationCard'
import PlayerTable from '@/components/tournamentEditor/scoreTable/PlayerTable'
import SelectWrapper from '@/components/tournamentEditor/challengePlayer/playerSelect'

const invited_placeholder = {
  name: 'JORMA',
  wins: 0,
  tie: 0,
  loss: 0,
  games: 0,
  points: 0,
}

const generatePlaceholders = (maxPlayers: number, acceptedCount: number) => {
  const placeholdersCount = maxPlayers - acceptedCount
  return new Array(placeholdersCount).fill(invited_placeholder)
}

export default function EditTournament() {
  const router = useRouter()
  const { id, name } = router.query
  const [email, setEmail] = useState('')
  const [sendInvitation] = useMutation(SEND_INVITATION)
  const [sendNotification] = useMutation(SEND_NOTIFICATION)
  const [ruleset, setRuleset] = useState<Ruleset | null>(null)
  const [rulesetId, setRulesetId] = useState<string | null>(null)
  const [maxPlayers, setMaxPlayers] = useState(0)
  const { data: session } = useSession()
  const [invitedUsers, setInvitedUsers] = useState<User[]>([])
  const [acceptedPlayers, setAcceptedPlayers] = useState<User[]>([])
  const placeholders = generatePlaceholders(maxPlayers, acceptedPlayers.length)
  const combinedPlayers = [...acceptedPlayers, ...placeholders]
  const [tournamentName, setTournamentName] = useState<string | null>(null)
  const [shouldFetchUser, setShouldFetchUser] = useState(false)

  const {
    data,
    error: userEmailError,
    loading,
  } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email: email },
    skip: !shouldFetchUser,
  })

  if (userEmailError) {
    console.error('Error fetching user by email:', userEmailError)
  }

  const {
    data: tournamentData,
    error: tournamentError,
    loading: tournamentLoading,
  } = useQuery(GET_TOURNAMENT_BY_ID, {
    variables: { ids: [id] },
    skip: !id,
  })

  let tournamentId
  if (
    tournamentData &&
    tournamentData.getTournamentsByIds &&
    tournamentData.getTournamentsByIds.length > 0
  ) {
    tournamentId = tournamentData.getTournamentsByIds[0].id
  }

  const localStorageKey = tournamentId ? `invitedUsers_${tournamentId}` : null

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorageKey) {
        const storedInvitedUsers = localStorage.getItem(localStorageKey)
        if (storedInvitedUsers) {
          setInvitedUsers(JSON.parse(storedInvitedUsers))
        }
      }
    }
  }, [localStorageKey])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorageKey && invitedUsers.length > 0) {
        localStorage.setItem(localStorageKey, JSON.stringify(invitedUsers))
      }
    }
  }, [invitedUsers, localStorageKey])

  if (tournamentError) {
    console.error('Error fetching tournament by ID:', tournamentError)
  }

  const { data: rulesetData, error: rulesetError } = useQuery(GET_RULESET_BY_ID, {
    variables: { id: rulesetId },
    skip: !rulesetId,
  })

  if (rulesetError) {
    console.error('Error fetching ruleset by ID:', rulesetError)
  }

  useEffect(() => {
    if (
      tournamentData &&
      tournamentData.getTournamentsByIds &&
      tournamentData.getTournamentsByIds.length > 0
    ) {
      const tournament: Tournament = tournamentData.getTournamentsByIds[0]

      if (tournament.players && Array.isArray(tournament.players)) {
        const playerIds = tournament.players.map((player) => player.id)

        const updatedInvitedUsers = invitedUsers.map((user): User => {
          if (playerIds.includes(user.id)) {
            return {
              ...user,
              status: 'joined',
            } as unknown as User
          }
          return user
        })

        const matchingUsers = invitedUsers.filter((user) => playerIds.includes(user.id))

        if (JSON.stringify(updatedInvitedUsers) !== JSON.stringify(invitedUsers)) {
          setInvitedUsers(updatedInvitedUsers)
        }
        setAcceptedPlayers(matchingUsers)
      }

      if (tournament.ruleset && tournament.ruleset.length > 0) {
        const rulesetIds = tournament.ruleset[0].id.toString()
        const playersAmount = tournament.maxPlayers
        setTournamentName(tournament.name)
        setMaxPlayers(playersAmount)
        setRulesetId(rulesetIds)
      }
    }
  }, [tournamentData, invitedUsers])

  useEffect(() => {
    if (rulesetData && rulesetData.ruleset) {
      setRuleset(rulesetData.ruleset)
    }
  }, [rulesetData])

  const handleSendInvitation = async () => {
    try {
      const response = await sendInvitation({
        variables: {
          tournamentId: id,
          email,
        },
      })

      const { success, message } = response.data.sendInvitation

      if (success) {
        alert('Invitation sent successfully!')
      } else {
        alert(`Error sending invitation: ${message}`)
      }
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Error sending invitation. Please try again later.')
    }
  }

  const handleSendNotification = async () => {
    try {
      const notificationResponse = await sendNotification({
        variables: {
          receiverEmail: email,
          sender: session && session.user.email,
          message: 'You have a new invitation from: ',
          date: new Date().toISOString(),
          isRead: false,
        },
      })
      console.log('Full notificationResponse:', notificationResponse)

      const notification = notificationResponse.data.createNotification
      if (notification && notification.id) {
        console.log('Notification sent successfully')
      } else {
        console.error('Error sending notification: No ID returned')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Error sending notification. Please try again later.')
    }
  }

  const handleSendBoth = async () => {
    try {
      setShouldFetchUser(true)
      await handleSendNotification()
      await handleSendInvitation()
      setShouldFetchUser(false)
    } catch (error) {
      console.error('Error sending both:', error)
      alert('Error sending both. Please try again later.')
    }
  }

  useEffect(() => {
    if (data && data.getUserByEmail) {
      const user: User = { ...data.getUserByEmail, status: 'pending' }
      setInvitedUsers((prevInvitedUsers) => [...prevInvitedUsers, user])
    }
  }, [data])

  return (
    <div className="flex flex-col items-center justify-top w-full h-full">
      <header className="flex flex-col items-center justify-center w-full h-1/6">
        <h1 className="text-4xl font-bold text-white">{tournamentName ? tournamentName : ''}</h1>
      </header>
      <PlayerTable combinedPlayers={combinedPlayers} />
      <div className="export-csv">
        <Button color="primary" startContent={<ExportIcon />}>
          Export to CSV
        </Button>
      </div>
      {acceptedPlayers.length < maxPlayers && (
        <>
          <InvitationCard email={email} setEmail={setEmail} handleSendBoth={handleSendBoth} />
          <TableWrapper invitedUsers={invitedUsers} />
        </>
      )}
      {acceptedPlayers.length >= maxPlayers ? (
        <SelectWrapper acceptedPlayers={acceptedPlayers} tournamentId={tournamentId} />
      ) : null}
    </div>
  )
}
