/**
 * @file userRoutes.js
 * @description This file handles the user routes.
 *
 * @datecreated 03.12.2024
 * @lastmodified 06.12.2024
 */


const express = require('express'); // Express web server framework
const router = express.Router(); // Router middleware
const User = require('../models/UserDB'); // User model

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    // Check if user already exists
    try {
        let user = await User({username, email, password});
        await user.save();
        res.status(201).json({message: 'User registered successfully', user});
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Test route
router.get('/test', (req, res) => {
    res.send('User route is working!');
});

module.exports = router;
