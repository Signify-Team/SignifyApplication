/**
 * @file UserDB.js
 * @description This file defines the User model for MongoDB.
 *
 * @datecreated 04.12.2024
 * @lastmodified 13.12.2024
 */

const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    languagePreference: { type: String },
    learningLanguages: [
        {
            languageId: { type: String, required: true }, // ID of the language being learned
            progress: { type: Number, default: 0 }, // Progress percentage in the language
            level: { type: Number, default: 1 }, // Level in the language
        },
    ],
    streakCount: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    achievements: [
        {
            achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
            dateEarned: { type: Date, default: Date.now },
        },
    ],
    badges: [
        {
            badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
            dateEarned: { type: Date, default: Date.now },
        },
    ],
    quests: [
        {
            questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
            status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
            dateAssigned: { type: Date, default: Date.now }, // When the quest was assigned
            lastDate: { type: Date }, // When the quest will no longer be available
            dateCompleted: { type: Date }, // When the quest was completed
        },
    ],
    notifications: [
        {
            notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
            isRead: { type: Boolean, default: false },
        },
    ],
    settings: {
        pushNotifications: { type: Boolean, default: true }, // Enable/disable push notifications
        emailNotifications: { type: Boolean, default: true }, // Enable/disable email notifications
        darkMode: { type: Boolean, default: false }, // Enable/disable dark mode
    },
    isPremium: { type: Boolean, default: false },
    premiumExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', UserSchema);