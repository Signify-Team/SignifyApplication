/**
 * @file badgeRoutes.js
 * @description This file handles the badge routes.
 *
 * @datecreated 15.02.2025
 * @lastmodified 18.02.2025
 */

const express = require('express');
const Badge = require('../models/BadgeDB');
const User = require('../models/UserDB');
const validator = require('validator');
const rateLimit = require('express-rate-limit'); // Import rate limiter
const mongoose = require('mongoose');
const router = express.Router();

const badgeRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, 
    message: 'Too many requests from this IP, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiter to all badge routes
router.use(badgeRateLimiter);

// Create a new badge with validation and sanitization
router.post('/', async (req, res) => {
    try {
        const { badgeId, name, description, iconUrl } = req.body;

        // Validate and sanitize inputs
        if (!badgeId || !name) {
            return res.status(400).json({ error: 'badgeId and name are required' });
        }

        if (badgeId && !validator.isAlphanumeric(badgeId)) {
            return res.status(400).json({ error: 'badgeId should be alphanumeric' });
        }

        // Ensure iconUrl is a valid URL
        if (iconUrl && !validator.isURL(iconUrl)) {
            return res.status(400).json({ error: 'Invalid URL format for iconUrl' });
        }

        const newBadge = new Badge({
            badgeId: badgeId.trim(),
            name: name.trim(),
            description: description ? description.trim() : '',
            iconUrl: iconUrl ? iconUrl.trim() : ''
        });

        const savedBadge = await newBadge.save();
        res.status(201).json({
            message: 'Badge created successfully',
            badge: savedBadge
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all badges with user input validation
router.get('/', async (req, res) => {
    try {
        const badges = await Badge.find()
        res.status(200).json(badges);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a badge by its ID with ID validation
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Ensure the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid badge ID format' });
    }

    try {
        const badge = await Badge.findById(id);
        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }
        res.status(200).json(badge);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update badge with input validation
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { badgeId, name, description, iconUrl } = req.body;

    // Ensure the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid badge ID format' });
    }

    // Validate and sanitize inputs
    if (!badgeId || !name) {
        return res.status(400).json({ error: 'badgeId and name are required' });
    }

    if (badgeId && !validator.isAlphanumeric(badgeId)) {
        return res.status(400).json({ error: 'badgeId should be alphanumeric' });
    }

    if (iconUrl && !validator.isURL(iconUrl)) {
        return res.status(400).json({ error: 'Invalid URL format for iconUrl' });
    }

    try {
        const updatedBadge = await Badge.findByIdAndUpdate(
            id,
            {
                badgeId: badgeId.trim(),
                name: name.trim(),
                description: description ? description.trim() : '',
                iconUrl: iconUrl ? iconUrl.trim() : ''
            },
            { new: true }
        );

        if (!updatedBadge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        res.status(200).json(updatedBadge);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a badge by its ID with ID validation
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Ensure the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid badge ID format' });
    }

    try {
        const deletedBadge = await Badge.findByIdAndDelete(id);
        if (!deletedBadge) {
            return res.status(404).json({ error: 'Badge not found' });
        }
        res.status(200).json({ message: 'Badge deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add a badge to a user's list when they complete an assignment
router.post('/users/:userId/:badgeId', async (req, res) => {
    const { userId, badgeId } = req.params;

    // Ensure userId and badgeId are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }

    if (!mongoose.Types.ObjectId.isValid(badgeId)) {
        return res.status(400).json({ error: 'Invalid badgeId format' });
    }

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the badge by badgeId
        const badge = await Badge.findById(badgeId);
        if (!badge) {
            return res.status(404).json({ error: 'Badge not found' });
        }

        // Check if the user already has the badge
        const existingBadge = user.badges.find(badge => badge.badgeId.toString() === badgeId);
        if (existingBadge) {
            return res.status(400).json({ error: 'User already has this badge' });
        }

        // Add the badge to the user's badges array
        user.badges.push({
            badgeId: badge._id,
            dateEarned: new Date(),
        });

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: 'Badge added to user successfully',
            user: user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
