/**
 * @file exerciseRoutes.js
 * @description This file handles the exercise routes.
 *
 * @datecreated 16.02.2025
 * @lastmodified 16.02.2025
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import Exercise from '../models/ExerciseDB.js';
import Course from '../models/CourseDB.js';

const router = express.Router();

// Rate limiter (100 requests per 15 minutes)
const exerciseLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests. Try again later.' }
});

// Get all exercises
router.get('/', exerciseLimiter, async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json(exercises);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific exercise by ID
router.get('/:id', exerciseLimiter, async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
        res.status(200).json(exercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all exercises for a specific course
router.get('/course/:courseId', exerciseLimiter, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('exercises');
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json(course.exercises);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start an exercise
router.post('/:id/start', exerciseLimiter, async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

        res.status(200).json({ message: `Exercise '${exercise.exerciseId}' started!`, exercise });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Finish an exercise by username
router.post('/:id/finish', exerciseLimiter, async (req, res) => {
    try {
        const { answer } = req.body;
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

        const isCorrect = exercise.correctAnswer.toLowerCase() === answer.toLowerCase();
        res.status(200).json({
            message: isCorrect ? 'Correct answer!' : 'Wrong answer. Try again!',
            correct: isCorrect,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new exercise
router.post('/', exerciseLimiter, [
    body('exerciseId').notEmpty().withMessage('exerciseId is required').isString().trim(),
    body('question').notEmpty().withMessage('question is required').isString().trim(),
    body('correctAnswer').notEmpty().withMessage('correctAnswer is required').isString().trim(),
    body('courseId').notEmpty().withMessage('courseId is required').isMongoId().withMessage('Invalid courseId format'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { exerciseId, question, correctAnswer, courseId } = req.body;

        // Check if the course exists
        const course = await Course.findOne({ _id: { $eq: courseId } });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check for duplicate exerciseId
        const existingExercise = await Exercise.findOne({ exerciseId: { $eq: exerciseId } });
        if (existingExercise) {
            return res.status(400).json({ message: 'Exercise ID already exists' });
        }

        const newExercise = new Exercise({ exerciseId, question, correctAnswer, courseId });
        await newExercise.save();

        // Add exercise to the course
        course.exercises.push(newExercise._id);
        await course.save();

        res.status(201).json(newExercise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an exercise
router.delete('/:id', exerciseLimiter, async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

        // Remove exercise from the associated course
        await Course.updateOne({ exercises: exercise._id }, { $pull: { exercises: exercise._id } });

        // Delete exercise
        await Exercise.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
