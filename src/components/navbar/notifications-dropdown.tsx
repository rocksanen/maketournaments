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
interface Props {
  session: any // Add the appropriate type for the session data
}

export const NotificationsDropdown = ({ session }: Props) => {
  const [notificationId, setNotificationId] = useState<string | null>(null)

  useEffect(() => {
    console.log(session?.user?.id, 'session user id')
    const eventSource = new EventSource(`/api/sse?userId=${session?.user?.id}`)

    eventSource.onopen = () => {
      console.log('SSE connection opened.')
    }

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const id = data
      console.log('notifikaatio komponentti', id)
      setNotificationId(id)
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close() // Close the connection on error
    }

    return () => {
      eventSource.close()
    }
  }, [notificationId])

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
