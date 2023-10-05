import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '@/models/userModel'
import { isPasswordValid } from '../../../utils/hash'
import { connectToDatabase } from '@/utils/db'
import { user } from '@nextui-org/react'
import { setupChangeStream } from '@/lib/mongoChangeStream'

export default NextAuth({
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
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
        setupChangeStream(userid)
      }
      return session
    },
  },
})
