/**
 * @file QuestDB.js
 * @description This file defines the Quest model for MongoDB.
 *
 * @datecreated 13.12.2024
 * @lastmodified 13.12.2024
 */

import mongoose from 'mongoose';

// Quest Schema
const QuestSchema = new mongoose.Schema({
    questId: { type: String, unique: true, sparse: true }, // Unique identifier with sparse index
    title: { type: String, required: true }, // Quest title
    description: { type: String }, // Detailed description
    rewardPoints: { type: Number, default: 0 }, // Points rewarded upon completion
    startDate: { type: Date, required: true }, // Start date for the quest
    deadline: { type: Date }, // Optional deadline for the quest
    language: { 
        type: String, 
        enum: ['ASL', 'TİD'],
        default: 'ASL'
    }, // Language of the quest
    questType: { 
        type: String, 
        required: true, 
        enum: ['daily', 'friend'],
        default: 'friend'
    }, // Type of quest
});

// Pre-save middleware to ensure questId matches _id
QuestSchema.pre('save', function(next) {
    // Set questId to be the same as _id
    this.questId = this._id.toString();
    next();
});

export default mongoose.model('Quest', QuestSchema);
