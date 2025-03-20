/**
 * @file userRoutes.js
 * @description This file handles the user routes.
 *
 * @datecreated 03.12.2024
 * @lastmodified 17.12.2024
 */

import express from 'express'; // Express web server framework
import bcrypt from 'bcrypt'; // For password hashing
import mongoose from 'mongoose'; // For MongoDB ObjectId validation
import User from '../models/UserDB.js'; // User model
import rateLimit from 'express-rate-limit';
import { sendVerificationEmail, sendResetPasswordEmail } from '../config/emailService.js';
import crypto from 'crypto';
const router = express.Router(); // Router middleware

const MINUTES_15 = 15000 * 60 * 1000;

const limiter = rateLimit({
    windowMs: MINUTES_15,
    max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
    message: { message: 'Too many requests, please try again later.' },
});
if (process.env.NODE_ENV !== 'test') {
    console.log("Applying rate limiter...");  // Log for verification
    router.use(limiter);
} else {
    console.log("Rate limiter disabled for testing.");
}

// Get all users (Admin only)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords for security
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
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
router.post('/login', async (req, res) => {
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
                _id: user._id,
                username: user.username,
                email: user.email,
                languagePreference: user.languagePreference
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route: Get user profile
router.get('/profile', async (req, res) => {
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
router.put('/update', async (req, res) => {
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

// Send verification code
router.post('/send-verification', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Generate a 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the code in the user document with expiration
        const user = await User.findOne({ email });
        if (!user) {
            // Create a new user document with provided credentials
            if (!password) {
                return res.status(400).json({ message: 'Password is required for new users' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                username,
                password: hashedPassword,
                verificationCode,
                verificationCodeExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
                isEmailVerified: false
            });
            await newUser.save();
        } else {
            // Update existing user's verification code
            user.verificationCode = verificationCode;
            user.verificationCodeExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
            await user.save();
        }

        // Send verification email
        await sendVerificationEmail(email, verificationCode);
        
        res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Send Verification Error:', error);
        res.status(500).json({ message: error.message || 'Failed to send verification code' });
    }
});

// Verify code
router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and verification code are required' });
    }

    try {
        const user = await User.findOne({ 
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Clear the verification code and mark as verified
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        user.isEmailVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify Code Error:', error);
        res.status(500).json({ message: 'Failed to verify code' });
    }
});

// Update language preference
router.post('/update-language', async (req, res) => {
    const { userId, language } = req.body;

    if (!userId || !language) {
        return res.status(400).json({ message: 'User ID and language are required' });
    }

    if (!['ASL', 'TID'].includes(language)) {
        return res.status(400).json({ message: 'Invalid language selection' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.languagePreference = language;
        await user.save();

        res.status(200).json({ message: 'Language preference updated successfully' });
    } catch (error) {
        console.error('Update Language Error:', error);
        res.status(500).json({ message: 'Failed to update language preference' });
    }
});

// Send reset password email
router.post('/send-reset-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();

        // Send reset password email
        await sendResetPasswordEmail(email, resetToken);
        
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Send Reset Password Error:', error);
        res.status(500).json({ message: 'Failed to send reset password email' });
    }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.status(200).send('User route is working!');
});

export default router;
