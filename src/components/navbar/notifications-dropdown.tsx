import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
} from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { NotificationIcon } from '../icons/navbar/notificationicon'

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<{ type: string; message: string }[]>([])

  useEffect(() => {
    const eventSource = new EventSource('/api/sse')

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = () => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          type: 'New Invitation',
          message: 'You have a new invitation',
        },
      ])
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close() // Close the connection on error
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
          {notifications.map((notification, index) => (
            <DropdownItem
              key={index}
              classNames={{
                base: 'py-2',
                title: 'text-base font-semibold',
              }}
            >
              {notification.type}: {notification.message}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
