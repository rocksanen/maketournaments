import AllSeries from '@/components/series/AllSeries'
import { useSession } from 'next-auth/react'
import { Link } from '@nextui-org/react'

function All() {
  const { data: session } = useSession()

  return (
    <div>
      {session ? (
        <AllSeries />
      ) : (
        <div>
          <h2>Not signed in</h2>
          <Link href="/login">Sign in</Link>
        </div>
      )}
    </div>
  )
}

export default All
