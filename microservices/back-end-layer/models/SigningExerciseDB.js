/**
 * @file SigningExercise.js
 * @description Schema for Signing exercises (Word to Sign, AI Evaluation).
 * @datecreated 18.03.2025
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';
import Exercise from './Exercise.js';

const SigningExerciseSchema = new mongoose.Schema({
    word: { type: String, required: true }, // The word the user must sign
});

export default Exercise.discriminator('Signing', SigningExerciseSchema);
