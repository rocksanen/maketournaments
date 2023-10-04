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
import { set } from 'mongoose'

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
  const [trigger, setTrigger] = useState<number>(0)


  console.log(session?.user?.id, 'session user id')

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse?userId=${session?.user?.id}`)
    eventSource.onmessage = (event) => {
      const data: Notification = JSON.parse(event.data)
      setNotificationId(data._id._data)
      setTrigger((prev) => prev + 1)
    }

    return () => {
      eventSource.close()
    }
  }, [session?.user?.id])

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
            description={trigger || ''}
            textValue={trigger.toString() || ''}
          >
            {trigger ? 'New Notification' : 'No New Notifications'}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
