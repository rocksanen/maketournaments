import userModel from '@/models/userModel'
import bcrypt from 'bcrypt'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'
import mockSessionResolver from '../../lib/mockSessionResolver'
import { Context } from '@/types/Context'

interface UserArgs {
  id: string
}

interface CreateUserArgs {
  input: {
    name: string
    email: string
    password: string
    // add other fields as necessary
  }
}

interface UpdateUserArgs {
  input: {
    id: string
    name?: string
    email?: string
    password?: string
    // add other fields as necessary
  }
}

interface DeleteUserArgs {
  id: string
}

interface SendInvitationArgs {
  tournamentId: string
  email: string
}

const userResolvers = {
  Query: {
    user: async (_: any, { id }: UserArgs) => {
      try {
        const user = await userModel.findById(id)
        return user
      } catch (error) {
        console.error('Failed to fetch user:', error)
        throw new Error('Failed to fetch user')
      }
    },

    allUsers: async (_: any, { limit, offset }: paginationArgs) => {
      try {
        const users = await userModel
          .find()
          .select('-password')
          .limit(Math.min(limit, MAX_QUERY_LIMIT))
          .skip(offset * Math.min(limit, MAX_QUERY_LIMIT))

        return users
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw new Error('Failed to fetch users')
      }
    },
    getUsersByIds: async (_: any, { ids }: { ids: string[] }) => {
      try {
        const users = await userModel.find({ _id: { $in: ids } }).select('-password')
        return users
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw new Error('Failed to fetch users')
      }
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: CreateUserArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(input.password, 10)

        const newUser = new userModel({
          ...input,
          password: hashedPassword,
        })

        const result = await newUser.save()
        return result
      } catch (error) {
        console.error('Failed to create user:', error)
        throw new Error('Failed to create user')
      }
    },

    updateUser: async (_: any, { input }: UpdateUserArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      const { id, ...rest } = input
      try {
        if (rest.password) {
          // Hash the new password before updating
          rest.password = await bcrypt.hash(rest.password, 10)
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, rest, {
          new: true, // returns the updated document
        })
        return updatedUser
      } catch (error) {
        console.error('Failed to update user:', error)
        throw new Error('Failed to update user')
      }
    },

    deleteUser: async (_: any, { id }: DeleteUserArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const deletedUser = await userModel.findByIdAndRemove(id)
        if (!deletedUser) {
          throw new Error('User not found')
        }
        return true
      } catch (error) {
        console.error('Failed to delete user:', error)
        throw new Error('Failed to delete user')
      }
    },
    sendInvitation: async (
      _: any,
      { tournamentId, email }: SendInvitationArgs,
      context: Context,
    ) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const user = await userModel.findOne({ email })
        if (user) {
          const tournamentExists = user.invitations.includes(tournamentId)

          if (tournamentExists) {
            throw new Error('Tournament already exists in invitations')
          }

          user.invitations.push(tournamentId)
          await user.save()

          return { success: true, message: 'Invitation sent successfully' }
        } else {
          // Implement email sending logic here
          return { success: true, message: 'Invitation sent successfully' }
        }
      } catch (error) {
        console.error('Error sending invitation:', error)
        throw new Error('Error sending invitation')
      }
    },
  },
}

export default userResolvers
