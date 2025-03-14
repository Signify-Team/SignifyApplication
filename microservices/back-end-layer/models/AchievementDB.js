/**
 * @file AchievementDB.js
 * @description This file defines the Achievement model for MongoDB.
 *
 * @datecreated 14.12.2024
 * @lastmodified 14.12.2024
 */

import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    achievementId: {
        type: String,
        unique: true, // Ensure uniqueness
        // Remove 'required' to allow automatic assignment
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rewardPoints: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to assign the _id to achievementId as a string
achievementSchema.pre('save', function (next) {
    if (!this.achievementId) {
        this.achievementId = this._id.toString(); // Automatically set achievementId to _id
    }
    next();
});

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
