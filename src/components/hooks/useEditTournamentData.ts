import { useQuery, useMutation } from '@apollo/client'
import { GET_USER_BY_EMAIL } from '@/graphql/clientQueries/userOperations'
import { GET_TOURNAMENT_BY_ID } from '@/graphql/clientQueries/tournamentOperations'
import { GET_RULESET_BY_ID } from '@/graphql/clientQueries/rulesetOperations'
import { SEND_INVITATION } from '@/graphql/clientQueries/invitationOperations'
import { SEND_NOTIFICATION } from '@/graphql/clientQueries/notificationOperations'

export const useEditTournamentData = (id, email, shouldFetchUser) => {
  const [sendInvitation] = useMutation(SEND_INVITATION)
  const [sendNotification] = useMutation(SEND_NOTIFICATION)

  const {
    data,
    error: userEmailError,
    loading,
  } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    skip: !shouldFetchUser,
  })

  const {
    data: tournamentData,
    error: tournamentError,
    loading: tournamentLoading,
  } = useQuery(GET_TOURNAMENT_BY_ID, {
    variables: { ids: [id] },
    skip: !id,
  })

  const { data: rulesetData, error: rulesetError } = useQuery(GET_RULESET_BY_ID, {
    variables: { id: rulesetId },
    skip: !rulesetId,
  })

  // Add other related logic and returns

  return {
    data,
    userEmailError,
    tournamentData,
    tournamentError,
    tournamentLoading,
    rulesetData,
    rulesetError,
    sendInvitation,
    sendNotification,
  }
}
