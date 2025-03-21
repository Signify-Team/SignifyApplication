/**
 * @file questRoutes.js
 * @description This file defines routes for the Quest model.
 * 
 * @datecreated 13.02.2025
 * @lastmodified 19.02.2025
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import Quest from '../models/QuestDB.js';
import User from '../models/UserDB.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
// rate limiter 
const questLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: 'Too many requests. Please try again later.' },
    statusCode: 429,
});

// Apply rate limiter to all course routes
router.use(questLimiter);

const completeQuestValidation = [
    body('userId').isMongoId().withMessage('Invalid user ID.'),
];

// Rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
});

// Create a new quest
router.post('/', async (req, res) => {
    try {
        const { title, description, rewardPoints, deadline } = req.body;
        
        // Create a new quest instance without questId (quest Id is assigned automatically)
        const newQuest = new Quest({
            title,
            description,
            rewardPoints,
            deadline,
        });

        // Save the quest to the database
        await newQuest.save();
        
        // Assign _id to questId (automatically generated quest ID)
        newQuest.questId = newQuest._id;
        await newQuest.save();

        res.status(201).json(newQuest);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quest', error });
    }
});

// Get all quests
router.get('/', async (req, res) => {
    try {
        const quests = await Quest.find();
        res.status(200).json(quests);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving quests', error });
    }
});

// Get a specific quest by questId
router.get('/:questId', async (req, res) => {
    try {
        const quest = await Quest.findOne({ questId: req.params.questId });
        if (!quest) {
            return res.status(404).json({ message: 'Quest not found' });
        }
        res.status(200).json(quest);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving quest', error });
    }
});

// Update a quest by questId
router.post('/:questId/complete', completeQuestValidation, async (req, res) => {
    // Validate request data (error message for possible ID errors)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const questId = req.params.questId;

    try {
        // Find the quest
        const quest = await Quest.findOne({ _id: questId });

        // Check if the quest exists
        if (!quest) {
            return res.status(404).json({ message: 'Quest not found' });
        }

        // Mark the quest as completed 
        quest.completed = true;
        await quest.save();

        return res.status(200).json({ message: 'Quest marked as completed successfully', quest });
    } catch (error) {
        console.error('Error completing quest:', error);
        return res.status(500).json({
            message: 'Error completing quest',
            error: error.message,
        });
    }
});

// Delete a quest by questId
router.delete('/:questId', async (req, res) => {
    try {
        const deletedQuest = await Quest.findOneAndDelete({ questId: req.params.questId });
        
        if (!deletedQuest) {
            return res.status(404).json({ message: 'Quest not found' });
        }

        res.status(204).send(); // No content to return on successful deletion
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quest', error });
    }
});

// Complete a quest by user
router.post('/:questId/complete', async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findOne({ _id: { $eq: userId } });
        const quest = await Quest.findOne({ questId: req.params.questId });

        if (!user || !quest) {
            return res.status(404).json({ message: 'User or Quest not found' });
        }

        // Check if the user has already completed this quest
        if (user.completedQuests.some(cq => cq.questId === quest.questId)) {
            return res.status(400).json({ message: 'Quest already completed' });
        }

        // Mark quest as completed by adding it to the user's completed quests
        user.completedQuests.push({ questId: quest.questId });
        await user.save();

        res.status(200).json({ message: 'Quest completed successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error completing quest', error });
    }
});

// Get completed quests for a user
router.get('/users/:userId/completed-quests', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('completedQuests.questId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.completedQuests);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving completed quests', error });
    }
});

export default router;