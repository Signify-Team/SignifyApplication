/**
 * @file UserAttempt.js
 * @description Schema to track user exercise attempts.
 * @datecreated 18.03.2025
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';

const UserAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who attempted the exercise
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true }, // The exercise attempted
    type: { type: String, enum: ['Matching', 'Multichoice', 'FillInTheBlank', 'Signing', 'TrueFalse'], required: true }, // Type of exercise (Matching, Multichoice, etc.)
    userAnswer: mongoose.Schema.Types.Mixed, // Stores user's selected answer (word, video, mapping, etc.)
    isCorrect: { type: Boolean, required: true }, // Whether the answer was correct or not
    accuracy: { type: Number, min: 0, max: 100 }, // For AI-evaluated exercises (e.g., Word to Sign)
    timestamp: { type: Date, default: Date.now } // Time of the attempt
});

export default mongoose.model('UserAttempt', UserAttemptSchema);
