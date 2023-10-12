import Notification from '@/models/notificationModel'
import { Context } from '@/types/Context'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'
import mockSessionResolver from '../../lib/mockSessionResolver'

interface GetNotificationArgs {
  receiverEmail: string
}

interface CreateNotificationArgs {
  input: {
    receiverEmail: string
    senderEmail: string
    message: string
    date: string // Assuming date is a string in ISO8601 format
    isRead: boolean // Add isRead to the input
  }
}

interface UpdateNotificationArgs {
  id: string
  input: {
    isRead: boolean
  }
}

interface DeleteNotificationArgs {
  id: string
}

const notificationResolvers = {
  Query: {
    getNotificationByReceiverEmail: async (_: any, { receiverEmail }: GetNotificationArgs) => {
      try {
        const notification = await Notification.findOne({ receiverEmail })
        return notification
      } catch (error) {
        console.error('Failed to fetch notification:', error)
        throw new Error('Failed to fetch notification')
      }
    },
    getNewestNotification: async (_: any, { receiverEmail }: GetNotificationArgs) => {
      try {
        const newestNotification = await Notification.findOne({ receiverEmail })
          .sort({ date: -1 }) // Sort by date in descending order to get the newest notification
          .limit(1)
        console.log('Newest notification:', newestNotification)
        return newestNotification
      } catch (error) {
        console.error('Failed to fetch newest notification:', error)
        throw new Error('Failed to fetch newest notification')
      }
    },
    getAllNotifications: async (_: any, { limit, offset }: paginationArgs) => {
      try {
        const notifications = await Notification.find()
          .limit(Math.min(limit, MAX_QUERY_LIMIT))
          .skip(offset * Math.min(limit, MAX_QUERY_LIMIT))
        return notifications
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        throw new Error('Failed to fetch notifications')
      }
    },
    getAllNotificationsByReceiverEmail: async (
      _: any,
      { receiverEmail }: { receiverEmail: string },
    ) => {
      try {
        const notifications = await Notification.find({ receiverEmail }).sort({ date: -1 })
        return notifications
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        throw new Error('Failed to fetch notifications')
      }
    },
  },

  Mutation: {
    createNotification: async (_: any, { input }: CreateNotificationArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const { receiverEmail, senderEmail, message, date, isRead } = input
        const newNotification = new Notification({
          receiverEmail,
          senderEmail,
          message,
          date,
          isRead,
        })
        const result = await newNotification.save()
        return result
      } catch (error) {
        console.error('Failed to create notification:', error)
        throw new Error('Failed to create notification')
      }
    },

    deleteNotification: async (_: any, { id }: DeleteNotificationArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const deletedNotification = await Notification.findByIdAndRemove(id)
        if (!deletedNotification) {
          throw new Error('Notification not found')
        }
        return true
      } catch (error) {
        console.error('Failed to delete notification:', error)
        throw new Error('Failed to delete notification')
      }
    },
    updateNotification: async (_: any, { id, input }: UpdateNotificationArgs, context: Context) => {
      const session = await mockSessionResolver(context)
      if (!session) {
        return {
          success: false,
          message: 'Please log in to access mutations',
        }
      }
      try {
        const updatedNotification = await Notification.findByIdAndUpdate(
          id,
          { $set: { isRead: input.isRead } },
          { new: true },
        )

        if (!updatedNotification) {
          throw new Error('Notification not found')
        }

        return updatedNotification
      } catch (error) {
        console.error('Failed to update notification:', error)
        throw new Error('Failed to update notification')
      }
    },
  },
}

export default notificationResolvers
