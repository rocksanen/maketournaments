import { gql } from '@apollo/client'

const GET_NOTIFICATIONS_BY_USER = gql`
  query GetNotificationsByUser($userId: ID!) {
    notificationsByUser(userId: $userId) {
      sender
      message
      user {
        id
      }
    }
  }
`
export { GET_NOTIFICATIONS_BY_USER }
