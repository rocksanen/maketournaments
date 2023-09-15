import { getUserSession } from '@/lib/actions/auth.actions'

export default async function Dashboard() {
  const { session } = await getUserSession()

  return <h1>{`Terve, ${session?.user?.name}. Äijähä on admin`}</h1>
}
