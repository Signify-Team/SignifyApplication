/**
 * @file userRoutes.js
 * @description This file handles the user routes.
 *
 * @datecreated 03.12.2024
 * @lastmodified 06.12.2024
 */


const express = require('express'); // Express web server framework
const bcrypt = require('bcrypt'); // For password hashing
const User = require('../models/UserDB'); // User model

const router = express.Router(); // Router middleware

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: { $eq: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
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
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route: Login an existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

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

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route: Get user profile
router.get('/profile', async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route: Update user preferences or progress
router.put('/update', async (req, res) => {
    const { userId, languagePreference, learningLanguages } = req.body;

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
        res.status(400).json({ message: error.message });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.send('User route is working!');
});

module.exports = router;