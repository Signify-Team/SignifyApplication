/**
 * @file notificationUtils.js
 * @description Utility functions for creating notifications
 * @datecreated 24.04.2025
 */

import Notification from '../models/NotificationDB.js';
import User from '../models/UserDB.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new notification for a user
 * @param {string} type - Type of notification ('streak', 'badge', 'course', 'general')
 * @param {string} title - Title of the notification
 * @param {string} message - Message content of the notification
 * @param {string} userId - ID of the user to notify
 * @returns {Promise<Object>} The created notification
 */
export const createNotification = async (type, title, message, userId) => {
    try {
        const notification = new Notification({
            notificationId: uuidv4(),
            userId,
            type,
            title,
            message,
            isRead: false,
            date: new Date()
        });

        await notification.save();
        
        // Increment unreadNotifications count for the user
        await User.findByIdAndUpdate(
            userId,
            { $inc: { unreadNotifications: 1 } }
        );
        
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}; 