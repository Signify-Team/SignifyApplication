/**
 * @file Exercise.js
 * @description This file defines the Exercise model for MongoDB.
 *
 * @datecreated 13.12.2024
 * @lastmodified 13.12.2024
 */

const mongoose = require('mongoose');

// Exercise Schema
const ExerciseSchema = new mongoose.Schema({
    exerciseId: { type: String, required: true, unique: true }, // Unique identifier
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Related course
    type: { type: String, enum: ['SignToWord', 'WordToSign'], required: true }, // Exercise type
    signVideoUrl: { type: String }, // URL for the sign video (for `SignToWord` type)
    word: { type: String }, // The displayed word (for `WordToSign` type)
    correctAnswer: { type: String, required: true }, // The correct answer (word or sign gesture name)
    options: [{ type: String }], // Possible answers (for `SignToWord` type)
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
