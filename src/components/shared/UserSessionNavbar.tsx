import { getUserSession } from '@/lib/actions/auth.actions'
import NavigationBar from './NavigationBar'

async function UserSessionNavbar() {
  const { session } = await getUserSession()

  return <NavigationBar session={session?.user} />
}

export default UserSessionNavbar
