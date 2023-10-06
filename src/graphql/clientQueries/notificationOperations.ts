import { gql } from '@apollo/client'

const GET_NOTIFICATIONS_BY_USER = gql`
  query GetNotificationsByUser($receiverEmail: String!) {
    notificationsByUser(receiverEmail: $receiverEmail) {
      receiverEmail
      message
      date
    }
  }
`

export { GET_NOTIFICATIONS_BY_USER }
