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

//kakkeli

export const NotificationsDropdown = () => {
  const [notificationId, setNotificationId] = useState<string | null>(null)

  useEffect(() => {
    const eventSource = new EventSource('/api/sse')

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const id = data.documentKey._id
      setNotificationId(id)
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
        <DropdownItem
            classNames={{
              base: 'py-2',
              title: 'text-base font-semibold',
            }}
            description={notificationId || ''}
            textValue={notificationId || ''}
          >
            {notificationId ? 'New Notification' : 'No New Notifications'}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
