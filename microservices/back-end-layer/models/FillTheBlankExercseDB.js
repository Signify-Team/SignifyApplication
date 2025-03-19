/**
 * @file FillInTheBlankExercise.js
 * @description Schema for Fill-in-the-Blank exercises.
 * @datecreated 18.03.2025
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';
import Exercise from './Exercise.js';

const FillInTheBlankExerciseSchema = new mongoose.Schema({
    sentence: { type: String, required: true }, // Sentence with a missing word
    options: [{ type: String, required: true }], // Video URLs for possible answers
    correctAnswerIndex: { type: Number, required: true }, // Index of the correct answer in options
});

export default Exercise.discriminator('FillInTheBlank', FillInTheBlankExerciseSchema);
