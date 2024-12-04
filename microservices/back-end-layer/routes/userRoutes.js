const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        let user = await User({name, email, password});
        await user.save();
        res.status(201).json({message: 'User registered successfully', user});
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.get('/test', (req, res) => {
    res.send('User route is working!');
});

module.exports = router;
