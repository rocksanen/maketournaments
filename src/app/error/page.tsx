'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Error() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errMsg = searchParams.get('error')

  return (
    <section>
      <h1>Errors: {errMsg}</h1>
      <Button onClick={() => router.back()} className="w-full mt-2">
        Try Again
      </Button>
    </section>
  )
}
