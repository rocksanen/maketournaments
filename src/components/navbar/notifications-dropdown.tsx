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

interface Notification {
  type: string
  message: string
  _id: {
    _data: string
  }
}

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse?`)

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = (event) => {
      console.log('triggeri tuli notificaatioihin')
      const data = JSON.parse(event.data)
      setNotifications((prevNotifications) => [...prevNotifications, data])
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
          <NotificationIcon />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Avatar Actions">
        <DropdownSection title="Notifications">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownItem
                key={notification._id._data} // Ensure each notification has a unique key
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
