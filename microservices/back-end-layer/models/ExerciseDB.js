/**
 * @file Exercise.js
 * @description Base model for all exercise types.
 *
 * @datecreated 13.12.2024
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';

const options = { discriminatorKey: 'type', collection: 'exercises' };

// Base Schema
const ExerciseSchema = new mongoose.Schema({
    exerciseId: { type: String, required: true, unique: true }, // Unique identifier
    type: { type: String, enum: ['Matching', 'Multichoice', 'FillInTheBlank', 'Signing', 'TrueFalse'], required: true }, // Type of exercise
}, options);

export default mongoose.model('Exercise', ExerciseSchema);
