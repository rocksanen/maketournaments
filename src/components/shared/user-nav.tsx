import Link from 'next/link'
import { getUserSession } from '@/lib/actions/auth.actions'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SignOutButton from '@/components/button/signout-button'
import { RxAvatar } from 'react-icons/rx'
async function UserNav() {
  const { session } = await getUserSession()

  return (
    <div>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center justify-center text-align-center">
              <RxAvatar size={25} />
              <p className="w-full text-center text-xs">{session?.user.name}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/signin">Sign in</Link>
      )}
    </div>
  )
}

export default UserNav
