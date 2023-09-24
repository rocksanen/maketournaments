import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from '@nextui-org/react'
import React from 'react'
import { DarkModeSwitch } from './darkmodeswitch'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export const UserDropdown = () => {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem key="profile" className="flex flex-col justify-start w-full items-start">
          <p>Signed in as</p>
          <p>{session?.user?.email || 'Error fetching email'}</p>
        </DropdownItem>
        <DropdownItem
          key="settings"
          onClick={() => router.push('/profile')} // Programmatically navigate to /profile on item click
        >
          Profile
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger "
          onClick={() => signOut()}
        >
          Log Out
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
