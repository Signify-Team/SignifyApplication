/**
 * @file BadgeDB.js
 * @description This file defines the Badge model for MongoDB.
 *
 * @datecreated 14.12.2024
 * @lastmodified 14.12.2024
 */

import mongoose from 'mongoose';

// Badge Schema
const BadgeSchema = new mongoose.Schema({
    badgeId: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // Badge title
    description: { type: String }, // Badge description
    iconUrl: { type: String }, // URL for badge icon
});

export default mongoose.model('Badge', BadgeSchema);