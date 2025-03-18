/**
 * @file MultichoiceExercise.js
 * @description Schema for Multichoice exercises (Two types: Sign-to-Word, Word-to-Sign).
 * @datecreated 18.03.2025
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';
import Exercise from './Exercise.js';

const MultichoiceExerciseSchema = new mongoose.Schema({
    subType: { 
        type: String, 
        enum: ['SignToWord', 'WordToSign'], 
        required: true 
    },
    signVideoUrl: { type: String }, // Used when subType = "SignToWord"
    word: { type: String }, // Used when subType = "WordToSign"
    options: [{ type: String, required: true }], // Possible answers (either words or sign video URLs)
    correctOption: { type: String, required: true } // Correct answer (word or video URL)
});

export default Exercise.discriminator('Multichoice', MultichoiceExerciseSchema);
