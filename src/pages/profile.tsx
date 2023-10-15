import { Card, CardHeader, Divider } from '@nextui-org/react'
import { GetServerSidePropsContext } from 'next'
import { getSession, useSession } from 'next-auth/react'

function Profile() {
  const { data: session } = useSession()
  console.log('sesh', session)

  return (
    <div className="py-5 flex justify-center">
      <Card className="max-w-[400px] flex justify-center items-center">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-small text-default-500">Username</p>
            <p className="text-md">{session?.user.name || 'Error fetching username'}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-small text-default-500">Email</p>
            <p className="text-md">{session?.user.email || 'Error fetching email'}</p>
          </div>
        </CardHeader>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-small text-default-500">ID</p>
            <p className="text-md">{session?.user.id || 'Error fetching id'}</p>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
//@ts-ignore
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permananet: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default Profile
