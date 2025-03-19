/**
 * @file UserProgress.js
 * @description Tracks user's progress on Sections, Courses, and Exercises.
 * @datecreated 18.03.2025
 * @lastmodified 18.03.2025
 */

import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID

    // Section Progress
    sections: [
        {
            sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
            coursesCompleted: { type: Number, default: 0 },
            totalCourses: { type: Number },
            isCompleted: { type: Boolean, default: false }
        }
    ],

    // Course Progress
    courses: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            exercisesCompleted: { type: Number, default: 0 }, // Number of exercises completed in this course
            totalExercises: { type: Number }, // Total exercises in the course
            isCompleted: { type: Boolean, default: false } // If the user has completed this course
        }
    ],

    // Exercise Progress
    exercises: [
        {
            exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
            attempts: { type: Number, default: 0 }, // Number of attempts
            isCorrect: { type: Boolean }, // Last attempt result
            accuracy: { type: Number, min: 0, max: 100 }, // AI-evaluated accuracy (for sign recognition)
            lastAttempt: { type: Date, default: null }
        }
    ]
});

export default mongoose.model('UserProgress', UserProgressSchema);
