/**
 * @file Achievement.js
 * @description This file defines the Achievement model for MongoDB.
 *
 * @datecreated 14.12.2024
 * @lastmodified 14.12.2024
 */

const mongoose = require('mongoose');

// Achievement Schema
const AchievementSchema = new mongoose.Schema({
    achievementId: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // Achievement name
    description: { type: String }, // Achievement description
    rewardPoints: { type: Number, default: 0 }, // Points for unlocking
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Achievement', AchievementSchema);