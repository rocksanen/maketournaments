import User from '@/models/userModel'
import { setupUserEmail } from '@/pages/api/sse'
import { connectToDatabase } from '@/utils/db'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { isPasswordValid } from '../../../utils/hash'

export const authOptions: NextAuthOptions = {
  // pages: {
  //   signIn: '/',
  // },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password',
        },
      },
      //@ts-ignore
      async authorize(credentials: any) {
        await connectToDatabase()

        const user = await User.findOne({ email: credentials.email })

        // Check if user exists
        if (!user) {
          return null
        }

        // Validate password
        const isPasswordMatch = await isPasswordValid(credentials.password, user.password)

        if (!isPasswordMatch) {
          return null
        }
        setupUserEmail(user.email)
        return {
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  callbacks: {
    async session({ session }) {
      if (session.user) {
        const user = await User.findOne({ email: session.user.email }).select('_id')
        const userid = user._id.toString()
        session.user.id = userid
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
