/**
 * @file TrueFalseExercise.js
 * @description Schema for True/False exercises. 
 * @datecreated 18.03.2025
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';
import Exercise from './Exercise.js';

const TrueFalseExerciseSchema = new mongoose.Schema({
    statement: { type: String, required: true }, // The statement to evaluate
    correctAnswer: { type: Boolean, required: true }, // True or False
});

export default Exercise.discriminator('TrueFalse', TrueFalseExerciseSchema);
