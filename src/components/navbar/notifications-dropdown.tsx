// notifications-dropdown.tsx

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
import { useSession } from 'next-auth/react'

interface Notification {
  type: string
  message: string
  _id: {
    _data: string
  }
}

export interface NotificationsDropdownProps {
  userId: string
}

export const NotificationsDropdown = ({ userId }: NotificationsDropdownProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  console.log('Received userId:', userId) // Added console log
  const { data: session } = useSession()
  useEffect(() => {
    if (!session) return
    const eventSource = new EventSource(`/api/sse?userId=${session.user.id}`)

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = (event) => {
      const data = event.data
      console.log(data)
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          type: data.type,
          message: data.message,
          _id: { _data: data },
        },
      ])
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [session?.user.id])


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
              description={'You have invitation to tournament: ' + notification._id._data}
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
