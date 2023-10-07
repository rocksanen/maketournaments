import NewSeries from '@/components/series/NewSeries'
import { Link } from '@nextui-org/react'
import { useSession } from 'next-auth/react'

function New() {
  const { data: session } = useSession()

  return (
    <div>
      {session ? (
        <NewSeries />
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
