'use client'

export const dynamic = 'force-dynamic'

import userModel from '@/model/userModel'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import gql from 'graphql-tag'

const query = gql`
  query {
    hello
  }
`

export default function PollPage() {
  const { data } = useSuspenseQuery(query)

  return <div>{data ? JSON.stringify(data) : <div>Loading...</div>}</div>
}
