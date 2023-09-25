import type { GetServerSidePropsContext, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Form from '../components/form'

const Home: NextPage = () => {
  return (
    <div>
      <Form />
    </div>
  )
}

//@ts-ignore
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: '/profile',
        permananet: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default Home
