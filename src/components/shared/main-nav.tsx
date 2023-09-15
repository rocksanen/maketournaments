'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { mainNavLinks } from '@/constants'
import { cn } from '@/lib/utils'

import { AiOutlineMenu } from 'react-icons/ai'

function MainNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="flex items-center lg:space-x-6 mx-4">
      <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
        <AiOutlineMenu />
      </button>
      <div
        className={cn(
          'absolute top-full left-0 w-full border bg-gray-100 dark:bg-gray-900',
          'lg:border-none lg:static lg:flex lg:space-x-6',
          menuOpen ? 'block' : 'hidden'
        )}
      >
        {mainNavLinks.map((link) => (
          <Link
            key={link.title}
            href={link.url}
            className={cn(
              'block py-2 px-4 text-sm',
              pathname === link.url
                ? 'dark:text-gray-400'
                : 'text-muted-foreground'
            )}
          >
            {link.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default MainNav
