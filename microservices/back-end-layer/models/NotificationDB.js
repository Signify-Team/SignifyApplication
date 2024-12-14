/**
 * @file NotificationDB.js
 * @description This file defines the Notification model for MongoDB.
 *
 * @datecreated 14.12.2024
 * @lastmodified 14.12.2024
 */

const mongoose = require('mongoose');

// Notification Schema
const NotificationSchema = new mongoose.Schema({
    notificationId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true }, // Notification message
    isRead: { type: Boolean, default: false }, // Read status
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);