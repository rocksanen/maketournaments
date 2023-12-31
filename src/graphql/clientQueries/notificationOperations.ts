import { gql } from '@apollo/client'

const GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL = gql`
  query GetAllNotificationsByReceiverEmail($receiverEmail: String!) {
    getAllNotificationsByReceiverEmail(receiverEmail: $receiverEmail) {
      id
      message
      senderEmail
      isRead
    }
  }
`

const UPDATE_NOTIFICATION = gql`
  mutation UpdateNotification($id: ID!, $input: UpdateNotificationInput!) {
    updateNotification(id: $id, input: $input) {
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
const SEND_NOTIFICATION = gql`
  mutation SendNotification(
    $receiverEmail: String!
    $sender: String!
    $message: String!
    $date: String!
    $isRead: Boolean!
  ) {
    createNotification(
      input: {
        receiverEmail: $receiverEmail
        senderEmail: $sender
        message: $message
        date: $date
        isRead: $isRead
      }
    ) {
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
  UPDATE_NOTIFICATION,
  GET_NEWEST_NOTIFICATION,
  SEND_NOTIFICATION,
}
