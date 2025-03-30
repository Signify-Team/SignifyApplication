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
    const userId = req.body.userId;

    try {
        const user = await User.findOne({ _id: { $eq: userId } });
        const quest = await Quest.findOne({ _id: req.params.questId });

        if (!user || !quest) {
            return res.status(404).json({ message: 'User or Quest not found' });
        }

        // Find the quest in user's quests array
        let userQuest = user.quests.find(q => q.questId.toString() === quest._id.toString());
        
        if (!userQuest) {
            // If quest doesn't exist in user's quests, add it
            user.quests.push({
                questId: quest._id,
                status: 'Completed',
                dateAssigned: new Date(),
                dateCompleted: new Date()
            });
        } else {
            // If quest exists, check if it's already completed
            if (userQuest.status === 'Completed') {
                return res.status(400).json({ message: 'Quest already completed' });
            }
            // Mark existing quest as completed
            userQuest.status = 'Completed';
            userQuest.dateCompleted = new Date();
        }

        // Save the user document
        const savedUser = await user.save();

        res.status(200).json({ 
            message: 'Quest completed successfully', 
            user: savedUser,
            quests: savedUser.quests 
        });
    } catch (error) {
        console.error('Error completing quest:', error); // Debug log
        res.status(500).json({ message: 'Error completing quest', error: error.message });
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

// Get completed quests for a user
router.get('/users/:userId/completed-quests', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate({
                path: 'quests.questId',
                select: 'title description rewardPoints deadline'
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Filter completed quests and format the response
        const completedQuests = user.quests
            .filter(q => q.status === 'Completed')
            .map(q => {
                return {
                    questId: q.questId._id,
                    title: q.questId.title,
                    description: q.questId.description,
                    rewardPoints: q.questId.rewardPoints,
                    deadline: q.questId.deadline,
                    dateCompleted: q.dateCompleted,
                    status: q.status,
                    collected: q.collected || false // Include collected status
                };
            });

        res.status(200).json(completedQuests);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving completed quests', error });
    }
});

// Collect quest reward
router.post('/:questId/collect-reward', async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        const quest = await Quest.findById(req.params.questId);

        if (!user || !quest) {
            return res.status(404).json({ message: 'User or Quest not found' });
        }

        // Find the quest in user's quests array
        const userQuest = user.quests.find(q => q.questId.toString() === quest._id.toString());
        
        if (!userQuest) {
            return res.status(404).json({ message: 'Quest not found in user quests' });
        }

        if (userQuest.status !== 'Completed') {
            return res.status(400).json({ message: 'Quest must be completed before collecting reward' });
        }

        if (userQuest.collected) {
            return res.status(400).json({ message: 'Reward already collected' });
        }

        // Update the quest to collected and add points to user
        userQuest.collected = true;
        user.totalPoints += quest.rewardPoints;

        // Save the changes
        await user.save();

        res.status(200).json({ 
            message: 'Reward collected successfully',
            pointsAwarded: quest.rewardPoints,
            totalPoints: user.totalPoints
        });
    } catch (error) {
        console.error('Error collecting reward:', error);
        res.status(500).json({ message: 'Error collecting reward', error: error.message });
    }
});

export default router;