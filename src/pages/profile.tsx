import { Button } from '@nextui-org/react'
import { Sign } from 'crypto'
import { GetServerSidePropsContext } from 'next'
import { getSession, signOut } from 'next-auth/react'
import React from 'react'

function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <Button onClick={() => signOut()}>logout</Button>
    </div>

  )
}
//@ts-ignore
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permananet: false,
      },
    };
  }

  return {
    props: { session },
  };
};


export default Profile