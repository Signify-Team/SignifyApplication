/**
 * @file QuestDB.js
 * @description This file defines the Quest model for MongoDB.
 *
 * @datecreated 13.12.2024
 * @lastmodified 13.12.2024
 */

const mongoose = require('mongoose');

// Quest Schema
const QuestSchema = new mongoose.Schema({
    questId: { type: String, unique: true }, // Unique identifier
    title: { type: String, required: true }, // Quest title
    description: { type: String }, // Detailed description
    rewardPoints: { type: Number, default: 0 }, // Points rewarded upon completion
    deadline: { type: Date }, // Optional deadline for the quest
});

module.exports = mongoose.model('Quest', QuestSchema);
