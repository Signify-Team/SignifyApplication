/**
 * @file achievementRoutes.js
 * @description This file handles the achievement routes.
 *
 * @datecreated 15.02.2025
 * @lastmodified 18.02.2025
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Achievement from '../models/AchievementDB.js';
import User from '../models/UserDB.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const achievementLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: 'Too many requests, please try again later.'
});

router.use(achievementLimiter);

// Create a new achievement
router.post('/', async (req, res) => {
    try {
        const achievement = new Achievement(req.body);
        await achievement.save();
        res.status(201).json({
            message: 'Achievement created successfully.',
            achievement: {
                achievementId: achievement.achievementId, // Automatically set to the same value as _id
                name: achievement.name,
                description: achievement.description,
                rewardPoints: achievement.rewardPoints,
                createdAt: achievement.createdAt,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all achievements
router.get('/', async (req, res) => {
    try {
        const achievements = await Achievement.find();
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single achievement by ID
router.get('/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const updateAchievementValidation = [
    body('title').optional().isString().withMessage('Title must be a string.'),
    body('description').optional().isString().withMessage('Description must be a string.'),
    body('points').optional().isNumeric().withMessage('Points must be a number.'),
];

// Update an achievement
router.put('/:id', updateAchievementValidation, async (req, res) => {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, points } = req.body;
        
        // Create an object for the fields that can be updated
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (points !== undefined) updateFields.points = points;

        const updatedAchievement = await Achievement.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true });

        if (!updatedAchievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        return res.status(200).json(updatedAchievement);
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating achievement',
            error: error,
        });
    }
});

// Delete an achievement
router.delete('/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all achievements unlocked by a user
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('achievements');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.achievements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unlock an achievement for a user
router.post('/users/:userId/:achievementId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const achievement = await Achievement.findById(req.params.achievementId);
        
        if (!user || !achievement) {
            return res.status(404).json({ message: 'User or Achievement not found' });
        }
        
        if (user.achievements.includes(achievement._id)) {
            return res.status(400).json({ message: 'Achievement already unlocked' });
        }
        
        user.achievements.push(achievement._id);
        user.points += achievement.rewardPoints;
        await user.save();
        
        res.json({ message: 'Achievement unlocked!', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark an achievement as collected
router.post('/users/:userId/:achievementId/collect', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const achievement = await Achievement.findById(req.params.achievementId);
        
        if (!user || !achievement) {
            return res.status(404).json({ message: 'User or Achievement not found' });
        }
        
        const achievementIndex = user.achievements.findIndex(a => a._id.equals(achievement._id));
        if (achievementIndex === -1) {
            return res.status(400).json({ message: 'Achievement not unlocked' });
        }
        
        if (user.achievements[achievementIndex].collected) {
            return res.status(400).json({ message: 'Achievement already collected' });
        }
        
        user.achievements[achievementIndex].collected = true;
        user.totalPoints += achievement.rewardPoints;
        await user.save();
        
        res.json({ 
            message: 'Achievement collected!', 
            totalPoints: user.totalPoints 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Daily reward route
router.post('/daily-reward/:userId', async (req, res) => {
    try {
        console.log('Daily reward request received for user:', req.params.userId);
        
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            console.log('Invalid user ID format:', req.params.userId);
            return res.status(400).json({ 
                message: 'Invalid user ID format',
                error: 'Invalid user ID'
            });
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log('User not found:', req.params.userId);
            return res.status(404).json({ 
                message: 'User not found',
                error: 'User not found'
            });
        }

        // Check if user has already collected reward today
        const today = new Date();
        const lastRewardDate = user.lastRewardDate ? new Date(user.lastRewardDate) : null;
        console.log('Last reward date:', lastRewardDate);

        if (lastRewardDate && 
            lastRewardDate.getDate() === today.getDate() &&
            lastRewardDate.getMonth() === today.getMonth() &&
            lastRewardDate.getFullYear() === today.getFullYear()) {
            console.log('Reward already collected today');
            return res.status(400).json({ 
                message: 'Daily reward already collected today',
                error: 'Reward already collected'
            });
        }

        // Award 50 points and update last reward date
        user.totalPoints += 50;
        user.lastRewardDate = today;
        await user.save();

        res.json({ 
            message: 'Daily reward collected!', 
            totalPoints: user.totalPoints 
        });
    } catch (error) {
        console.error('Error in daily reward route:', error);
        res.status(500).json({ 
            message: 'Error collecting daily reward',
            error: error.message 
        });
    }
});

export default router;