import React from 'react'
import { useSession } from 'next-auth/react'
import { Link } from '@nextui-org/react'
import NewTournament from '@/components/createTourney/new-tournament'

function New() {
  const { data: session } = useSession()

  return (
    <div>
      {session ? (
        <NewTournament />
      ) : (
        <div>
          <h2>Not signed in</h2>
          <Link href="/login">Sign in</Link>
        </div>
      )}
    </div>
  )
}

export default New
