import { gql } from '@apollo/client'

const GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL = gql`
  query GetAllNotificationsByReceiverEmail($receiverEmail: String!) {
    getAllNotificationsByReceiverEmail(receiverEmail: $receiverEmail) {
      id
      message
      senderEmail
    }
  }
`

const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    updateNotification(id: $id) {
      id
      isRead
    }
  }
`

export { GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL, MARK_NOTIFICATION_AS_READ }
