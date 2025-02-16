/**
 * @file wordRoutes.js
 * @description This file handles the word routes.
 *
 * @datecreated 16.02.2025
 * @lastmodified 16.02.2025
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Word = require('../models/WordDB');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// rate limiter 
const wordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests. Please try again later.' },
    statusCode: 429,
});
if (process.env.NODE_ENV !== 'test') {
    console.log("Applying rate limiter...");  // Log for verification
    router.use(wordLimiter);
} else {
    console.log("Rate limiter disabled for testing.");
}
// Get all words
router.get('/', wordLimiter, async (req, res) => {
    try {
        const words = await Word.find();
        res.status(200).json(words);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific word by ID
router.get('/:id', async (req, res) => {
    try {
        const word = await Word.findById(req.params.id);
        if (!word) return res.status(404).json({ message: 'Word not found' });
        res.status(200).json(word);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new word with validation
router.post(
    '/',
    wordLimiter, // Apply rate limiting
    [
        body('wordId')
            .notEmpty().withMessage('wordId is required')
            .isString().withMessage('wordId must be a string')
            .trim(),
        body('name')
            .notEmpty().withMessage('name is required')
            .bail()
            .isString().withMessage('name must be a string')
            .trim(),
        body('videoUrl')
            .notEmpty().withMessage('videoUrl is required')
            .isURL().withMessage('Invalid URL format'),
        body('description')
            .optional()
            .isString().withMessage('Description must be a string')
            .trim(),
    ],
    async (req, res) => {
        // Validate incoming request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check if wordId already exists
            const existingWord = await Word.findOne({ wordId: req.body.wordId });
            if (existingWord) {
                return res.status(400).json({ error: 'wordId must be unique. This wordId already exists.' });
            }

            // Create a new word from the request body
            const newWord = new Word(req.body);

            // Save the new word to the database
            await newWord.save();

            // Respond with the created word data
            res.status(201).json(newWord);
        } catch (err) {
            // Handle any errors during the save process
            res.status(500).json({ error: err.message });
        }
    }
);


// Delete a word with existence check
router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const word = await Word.findById(req.params.id);
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }
        await Word.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Word deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;