'use client'

import React from 'react'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from '@nextui-org/react'
import { signOut } from 'next-auth/react'
import { Session } from '../../types/next-auth'
import SignOutButton from '../button/signout-button'
import { usePathname } from 'next/navigation'
import ModeToggle from './mode-toggle'

export default function NavigationBar({ session }: { session: Session }) {
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const mainNavLinks = [
    { title: 'About', url: '/about' },
    { title: 'Tournaments', url: '/tourneys' },
  ]

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-black dark:text-white">
            Maketournament
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <Link href="/" className="font-bold text-black dark:text-white">
            Maketournament
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {mainNavLinks.map((link) => (
          <NavbarItem key={link.url}>
            <Link
              color={pathname === link.url ? 'secondary' : 'foreground'}
              href={link.url}
            >
              {link.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <ModeToggle />
        {session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{session.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">
                <Link href="/profile" className="block">
                  <p className="font-semibold">Profile</p>
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                <SignOutButton />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Link href="/signin">Sign in</Link>
        )}
      </NavbarContent>

      <NavbarMenu>
        {mainNavLinks.map((link) => (
          <NavbarMenuItem key={link.url}>
            <Link
              color={pathname === link.url ? 'secondary' : 'foreground'}
              href={link.url}
            >
              {link.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
