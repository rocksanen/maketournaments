import React, { useEffect, useState } from 'react'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
} from '@nextui-org/react'
import { NotificationIcon } from '../icons/navbar/notificationicon'
import { gql, useMutation } from '@apollo/client'

const SEND_NOTIFICATION = gql`
  mutation SendNotification($userId: ID!, $notification: NotificationInput!) {
    sendNotification(userId: $userId, notification: $notification) {
      success
      message
    }
  }
`

interface Notification {
  type: string
  message: string
  documentKey: {
    _id: string
    invitations: string[] // Assuming invitations is an array of strings
  }
}

export const NotificationsDropdown = ({ userId }: { userId: string }) => {
  const [sendNotificationMutation] = useMutation(SEND_NOTIFICATION)
  const [userNotifications, setNotifications] = useState<Notification[]>([])

  const sendNotification = async (notification: Notification) => {
    try {
      const { type, message, documentKey } = notification

      if (!documentKey.invitations || documentKey.invitations.length === 0) {
        console.error('No invitations found in notification')
        return
      }

      const tournamentId = documentKey.invitations[0]

      const { data } = await sendNotificationMutation({
        variables: {
          userId,
          notification: {
            type,
            message,
            documentKey: {
              _id: tournamentId,
            },
          },
        },
      })

      if (data.sendNotification.success) {
        console.log('Notification sent successfully')
      } else {
        console.error('Error sending notification:', data.sendNotification.message)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  useEffect(() => {
    const eventSource = new EventSource('/api/sse')

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = (event) => {
      const data: Notification = JSON.parse(event.data)
      setNotifications((prevNotifications) => [...prevNotifications, data])
      sendNotification(data) // Send notification to the server
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close() // Close the connection on error
    }

    return () => {
      eventSource.close()
    }
  }, [userId]) // Make sure to include userId as a dependency

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Avatar Actions">
        <DropdownSection title="Notifications">
          {userNotifications.map((notification, index) => (
            <DropdownItem
              key={index}
              classNames={{
                base: 'py-2',
                title: 'text-base font-semibold',
              }}
              description={'You have been invited to tournament: ' + notification.documentKey._id}
              textValue={notification.documentKey._id}
            >
              {notification.type}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
