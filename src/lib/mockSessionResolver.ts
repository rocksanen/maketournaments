import { test } from '@jest/globals';
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { Context } from '@/types/Context'
import { Session } from 'next-auth'

const mockSession: Session = {
  user: {
    name: 'eetu',
    email: 'eetu@mail.gov',
    id: 'mockuserid',
    _id: 'mockuserid',
    role: 'testrole',
    provider: 'mockprovider',
  },
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  token: {
    _id: 'mockuserid',
    role: 'testrole',
    provider: 'credentials',
  },
}
// return mocksession if env is test
export default async function mockSessionResolver(context: Context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (process.env.ENV === 'test') {
    return mockSession
  }
  return session
}
