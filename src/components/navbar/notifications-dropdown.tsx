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
import { useSession } from 'next-auth/react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL,
  UPDATE_NOTIFICATION,
} from '@/graphql/clientQueries/notificationOperations'
import { useRouter } from 'next/router'

interface Notificationz {
  id: string
  senderEmail: string
  message: string
  date: string
  isRead: boolean
}

export const NotificationsDropdown = () => {
  const { data: session } = useSession()
  const userEmail = session?.user?.email || ''
  const [notifications, setNotifications] = useState<Notificationz[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  const { data: initialData, refetch: refetchNotifications } = useQuery(
    GET_ALL_NOTIFICATIONS_BY_RECEIVER_EMAIL,
    {
      variables: { receiverEmail: userEmail },
      skip: !userEmail,
    },
  )

  const [updateNotification] = useMutation(UPDATE_NOTIFICATION)

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await updateNotification({
        variables: { id: notificationId, input: { isRead: true } },
      })
    } catch (error) {
      console.error('Failed to update notification:', error)
    }
  }

  useEffect(() => {
    if (initialData && initialData.getAllNotificationsByReceiverEmail) {
      const allNotifications = initialData.getAllNotificationsByReceiverEmail
      const unreadNotifications = allNotifications.filter(
        (notification: Notificationz) => !notification.isRead,
      )
      setNotifications(allNotifications)
      setUnreadCount(unreadNotifications.length)
    }
  }, [initialData])

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      await refetchNotifications()
      router.push('/tourneys/invitations')
    } catch (error) {
      console.error('Failed to update notification:', error)
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse`)

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = async (event) => {
      try {
        const eventData = JSON.parse(event.data)
        const newNotification: Notificationz = {
          id: eventData.fullDocument._id,
          message: eventData.fullDocument.message,
          senderEmail: eventData.fullDocument.senderEmail,
          date: eventData.fullDocument.date,
          isRead: eventData.fullDocument.isRead,
        }

        if (newNotification) {
          setNotifications((prevNotifications) => [newNotification, ...prevNotifications])
          setUnreadCount((prevCount) => prevCount + 1)
        }
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
  }, [])

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
            notifications.map((notification) => (
              <DropdownItem
                key={notification.id}
                classNames={{
                  base: `py-2 ${notification.isRead ? 'read-notification' : 'unread-notification'}`,
                  title: 'text-base font-semibold',
                }}
                description={`${notification.message} ${notification.senderEmail} ${
                  'Notification id: ' + notification.id
                }`}
                textValue={notification.message}
                onClick={() => handleNotificationClick(notification.id)}
              >
                New Invitation
              </DropdownItem>
            ))
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
