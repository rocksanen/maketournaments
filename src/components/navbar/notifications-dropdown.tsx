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
import { GET_NOTIFICATIONS_BY_USER } from '@/graphql/clientQueries/notificationOperations'
import { useSession } from 'next-auth/react'
import { useQuery } from '@apollo/client'

interface Notification {
  sender: string
  message: string
  date: string
}

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null

  const { loading, error, data } = useQuery(GET_NOTIFICATIONS_BY_USER, {
    variables: { userId },
    skip: !userId,
  })

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse?`)

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = (event) => {
      console.log('triggeri tuli notificaatioihin')
      const eventData = JSON.parse(event.data)
      setNotifications((prevNotifications) => [...prevNotifications, eventData])
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  /*
  useEffect(() => {
    if (data) {
      setNotifications(data.notificationsByUser)
    }
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  */
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Avatar Actions">
        <DropdownSection title="Notifications">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <DropdownItem
                key={index}
                classNames={{
                  base: 'py-2',
                  title: 'text-base font-semibold',
                }}
                description={notification.message}
                textValue={notification.message}
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
