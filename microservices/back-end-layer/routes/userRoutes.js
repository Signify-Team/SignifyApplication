/**
 * @file userRoutes.js
 * @description This file handles the user routes.
 *
 * @datecreated 03.12.2024
 * @lastmodified 17.12.2024
 */

const express = require('express'); // Express web server framework
const bcrypt = require('bcrypt'); // For password hashing
const mongoose = require('mongoose'); // For MongoDB ObjectId validation
const User = require('../models/UserDB'); // User model
const rateLimit = require('express-rate-limit');
const router = express.Router(); // Router middleware

const MINUTES_15 = 15 * 60 * 1000;

const registerLimiter = rateLimit({
    windowMs: MINUTES_15,
    max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
    message: { message: 'Too many requests, please try again later.' },
});
const loginLimiter = rateLimit({
    windowMs: MINUTES_15,
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
});

const profileLimiter = rateLimit({
    windowMs: MINUTES_15,
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
});

const updateLimiter = rateLimit({
    windowMs: MINUTES_15,
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
});

router.post('/register', registerLimiter, async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: { $eq: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' }); // Change status code to 400
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        return res.status(201).json({ message: 'User registered successfully', user: {
            _id: user._id, // Ensure _id is included in the response
            username: user.username,
            email: user.email,
        }});
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route: Login an existing user
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email: { $eq: email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id, // Ensure _id is included in the response
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route: Get user profile
router.get('/profile', profileLimiter, async (req, res) => {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route: Update user preferences or progress
router.put('/update', updateLimiter, async (req, res) => {
    const { userId, languagePreference, learningLanguages } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (languagePreference) user.languagePreference = languagePreference;
        if (learningLanguages) user.learningLanguages = learningLanguages;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(400).json({ message: 'Failed to update user preferences' }); // Improved error message
    }
});

// Test route
router.get('/test', (req, res) => {
    res.status(200).send('User route is working!');
});

module.exports = router;
