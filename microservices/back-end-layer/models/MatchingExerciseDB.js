/**
 * @file MatchingExercise.js
 * @description Schema for Matching exercises (Match Videos to Words).
 * @datecreated 18.03.2025
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';
import Exercise from './Exercise.js';

const MatchingExerciseSchema = new mongoose.Schema({
    pairs: [
        {
            signVideoUrl: { type: String, required: true }, // Sign language video
            word: { type: String, required: true } // Corresponding word
        }
    ]
});

export default Exercise.discriminator('Matching', MatchingExerciseSchema);
