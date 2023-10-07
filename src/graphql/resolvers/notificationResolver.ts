import Notification from '@/models/notificationModel'
import { paginationArgs } from '@/types/paginationArgs'
import { MAX_QUERY_LIMIT } from '@/utils/constants'

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
        const notifications = await Notification.find({ receiverEmail })
        return notifications
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        throw new Error('Failed to fetch notifications')
      }
    },
  },

  Mutation: {
    createNotification: async (_: any, { input }: CreateNotificationArgs) => {
      try {
        const newNotification = new Notification(input)
        const result = await newNotification.save()
        return result
      } catch (error) {
        console.error('Failed to create notification:', error)
        throw new Error('Failed to create notification')
      }
    },

    deleteNotification: async (_: any, { id }: DeleteNotificationArgs) => {
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
    updateNotification: async (_: any, { id }: UpdateNotificationArgs) => {
      try {
        const updatedNotification = await Notification.findByIdAndUpdate(
          id,
          { $set: { isRead: true } }, // Hardcoded to set isRead to true
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
