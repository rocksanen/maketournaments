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

const GET_NEWEST_NOTIFICATION = gql`
  query GetNewestNotification($receiverEmail: String!) {
    getNewestNotification(receiverEmail: $receiverEmail) {
      id
      receiverEmail
      senderEmail
      message
      date
      isRead
    }
  }
`

export {
  GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL,
  MARK_NOTIFICATION_AS_READ,
  GET_NEWEST_NOTIFICATION,
}
