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
    const eventSource = new EventSource('/api/sse')

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          type: data.type, // Assuming type is available in data
          message: data.message, // Assuming message is available in data
          _id: { _data: data._id }, // Assuming _id is available in data
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
              description={'You have new invitation from user: ' + notification._id._data}
              textValue={notification._id._data}
            >
              {notification.type}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
