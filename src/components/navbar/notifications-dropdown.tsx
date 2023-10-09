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
import {
  GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL,
  GET_NEWEST_NOTIFICATION,
  UPDATE_NOTIFICATION, // Import the mutation
} from '@/graphql/clientQueries/notificationOperations' // Assuming you have this import

import { useSession } from 'next-auth/react'
import { useQuery, useMutation } from '@apollo/client'
import { set } from 'mongoose'

interface Notificationz {
  id: string
  senderEmail: string
  message: string
  date: string
  isRead: boolean
}

export const NotificationsDropdown = () => {
  console.log('NotificationsDropdown component mounted')
  const { data: session } = useSession()
  const userEmail = session?.user?.email || ''
  const [notifications, setNotifications] = useState<Notificationz[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { data: initialData } = useQuery(GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL, {
    variables: { receiverEmail: userEmail },
    skip: !userEmail,
  })

  const { data: newestNotification } = useQuery(GET_NEWEST_NOTIFICATION, {
    variables: { receiverEmail: userEmail },
    skip: !userEmail,
  })

  const [updateNotification] = useMutation(UPDATE_NOTIFICATION) // Add this line

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await updateNotification({
        variables: { id: notificationId, input: { isRead: true } }, // Change updateNotificationId to id
      })
    } catch (error) {
      console.error('Failed to update notification:', error)
    }
  }

  useEffect(() => {
    console.log('Initial Data:', initialData) // Add this line
    if (initialData && initialData.getAllNotificationsByReceiverEmail) {
      const allNotifications = initialData.getAllNotificationsByReceiverEmail
      const unreadNotifications = allNotifications.filter(
        (notification: Notificationz) => !notification.isRead,
      )
      setNotifications(allNotifications) // Set all notifications first
      setUnreadCount(unreadNotifications.length) // Then set the unread count
      console.log('Unread notifications count:', unreadNotifications.length)
    }
  }, [initialData])

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId) // Call the markNotificationAsRead function
    } catch (error) {
      console.error('Failed to update notification:', error)
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse`)

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = async () => {
      console.log('SSE message received in notification dropdown:')
      try {
        setNotifications((prevNotifications) => {
          return [...prevNotifications, newestNotification.getNewestNotification]
        })
        setUnreadCount((prevCount) => prevCount + 1)
      } catch (error) {
        console.error('Error refetching notifications:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [newestNotification])

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon unreadCount={unreadCount} />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Avatar Actions">
        <DropdownSection title="Notifications">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              return (
                <DropdownItem
                  key={index}
                  classNames={{
                    base: 'py-2',
                    title: 'text-base font-semibold',
                  }}
                  description={
                    notification
                      ? `${notification.message} ${notification.senderEmail} ${notification.id}`
                      : ''
                  }
                  textValue={notification ? notification.message : ''}
                  onClick={() => {
                    try {
                      if (notification) {
                        handleNotificationClick(notification.id)
                      }
                    } catch (error) {
                      console.error('Error handling notification click:', error)
                    }
                  }}
                >
                  New Invitation
                </DropdownItem>
              )
            })
          ) : (
            <DropdownItem
              classNames={{
                base: 'py-2',
                title: 'text-base font-semibold',
              }}
              description="No new notifications"
              textValue="No new notifications"
            >
              No New Notifications
            </DropdownItem>
          )}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
