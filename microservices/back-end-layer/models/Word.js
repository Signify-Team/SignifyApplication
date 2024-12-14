/**
 * @file Word.js
 * @description This file defines the Word model for MongoDB.
 *
 * @datecreated 14.12.2024
 * @lastmodified 14.12.2024
 */

const mongoose = require('mongoose');

// Word Schema
const WordSchema = new mongoose.Schema({
    wordId: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // Word in text form
    videoUrl: { type: String, required: true }, // URL to the video of the sign
    description: { type: String }, // Optional description or usage of the word
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Word', WordSchema);