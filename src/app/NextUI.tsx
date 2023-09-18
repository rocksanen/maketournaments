'use client'
import { NextUIProvider } from '@nextui-org/react'

export default function NextUI({ children }: React.PropsWithChildren) {
  return <NextUIProvider>{children}</NextUIProvider>
}
