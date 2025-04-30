/**
 * @file UserDB.js
 * @description This file defines the User model for MongoDB.
 *
 * @datecreated 04.12.2024
 * @lastmodified 14.12.2024
 */

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

// User Schema
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, default: uuidv4 }, // Generate userId automatically
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    languagePreference: { type: String, enum: ['ASL', 'TID'] },
    lastLoginDate: { type: Date, default: null }, // Track last login date
    lastCourseCompletionDate: { type: Date, default: null }, // Track last course completion date
    learningLanguages: [
        {
            languageId: { type: String,required: true, enum: ['ASL', 'TID'],}, 
            progress: { type: Number, default: 0 }, // Progress percentage in the language
            level: { type: Number, default: 1 }, // Level in the language
        },
    ],
    courseProgress: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
            isLocked: { type: Boolean, default: true },
            progress: { type: Number, default: 0 },
            completed: { type: Boolean, default: false },
            lastAccessed: { type: Date },
            unlockDate: { type: Date }
        }
    ],
    progress: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProgress' },
    streakCount: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    achievements: [
        {
            achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
            dateEarned: { type: Date, default: Date.now },
            collected: { type: Boolean, default: false },
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
            collected: { type: Boolean, default: false }, // Whether the reward has been collected
        },
    ],
    unreadNotifications: { type: Number, required: true, default: 0 },
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
    unlockedSections: [{ type: String }], // Array of unlocked section IDs
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Update the `updatedAt` field before saving
UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('User', UserSchema);
