/**
 * @file achievementRoutes.js
 * @description This file handles the achievement routes.
 *
 * @datecreated 15.02.2025
 * @lastmodified 18.02.2025
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const Achievement = require('../models/AchievementDB');
const User = require('../models/UserDB'); // Assuming users are stored in UserDB

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

// Update an achievement
router.put('/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

module.exports = router;