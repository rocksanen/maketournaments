'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs'

export default function ModeToggle() {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <Button onClick={toggleTheme}>
      <BsFillSunFill
        className={`h-[1.2rem] w-[1.2rem] ${
          theme === 'dark' ? 'block' : 'hidden'
        }`}
      />
      <BsFillMoonFill
        className={`h-[1.2rem] w-[1.2rem] ${
          theme !== 'dark' ? 'block' : 'hidden'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
