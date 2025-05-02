/**
 * @file NotificationDB.js
 * @description This file defines the Notification model for MongoDB.
 *
 * @datecreated 14.12.2024
 * @lastmodified 14.12.2024
 */

import mongoose from 'mongoose';

// Notification Schema
const NotificationSchema = new mongoose.Schema({
    notificationId: { type: String, required: true,unique: true,},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true }, // Notification message
    isRead: { type: Boolean, default: false }, // Read status
    type: { 
        type: String, 
        required: true,
        enum: ['streak', 'badge', 'course', 'general', 'follow', 'quest'],
        default: 'general'
    },
    title: { type: String },
    date: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', NotificationSchema);