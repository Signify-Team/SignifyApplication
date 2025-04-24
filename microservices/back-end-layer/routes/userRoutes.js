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
    max: 1000, // Increased from 100 to 1000
    message: { message: 'Too many requests, please try again later.' },
});

// Only apply rate limiter in production
if (process.env.NODE_ENV === 'production') {
    console.log("Applying rate limiter for production...");
    router.use(limiter);
} else {
    console.log("Rate limiter disabled for development/testing.");
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
            return res.status(409).json({ message: 'Email is already registered' }); // Change status code to 409
        }

        const existingUsername = await User.findOne({ username: { $eq: username } });
        if (existingUsername) {
            return res.status(409).json({ message: 'Username is already registered' }); // Change status code to 409
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

        // Get current date and yesterday's date
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);

        // Format dates to compare only the date part (ignoring time)
        const formatDate = (date) => {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        const currentDateFormatted = formatDate(currentDate);
        const yesterdayFormatted = formatDate(yesterday);
        const lastLoginFormatted = user.lastLoginDate ? formatDate(user.lastLoginDate) : null;

        let streakMessage = null;
        const oldStreakCount = user.streakCount;

        // Update streak count based on login pattern
        if (!lastLoginFormatted) {
            // First time login
            user.streakCount = 1;
            streakMessage = "Welcome! Start your learning streak today!";
        } else if (currentDateFormatted.getTime() === lastLoginFormatted.getTime()) {
            // Already logged in today - do nothing
        } else if (yesterdayFormatted.getTime() === lastLoginFormatted.getTime()) {
            // Logged in yesterday - increment streak
            user.streakCount += 1;
            streakMessage = `Congratulations! Your streak is now ${user.streakCount} days!`;
        } else {
            // Missed a day - reset streak
            user.streakCount = 1;
            streakMessage = "Try to log in every day to maintain your streak!";
        }

        // Update last login date
        user.lastLoginDate = currentDate;
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                languagePreference: user.languagePreference,
                streakCount: user.streakCount
            },
            streakMessage: streakMessage
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
        // Check if user already exists
        const existingUser = await User.findOne({ email: { $eq: email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const existingUsername = await User.findOne({ username: { $eq: username } });
        if (existingUsername) {
            return res.status(409).json({ message: 'Username is already registered' });
        }

        // Generate a 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
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
            email: { $eq: email },
            verificationCode: { $eq: code },
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
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

        res.status(200).json({ message: 'Language preference updated successfully', language: user.languagePreference });
    } catch (error) {
        console.error('Update Language Error:', error);
        res.status(500).json({ message: 'Failed to update language preference' });
    }
});

// Get user's language preference
router.get('/language-preference/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ language: user.languagePreference || 'ASL' }); // Default to ASL if not set
    } catch (error) {
        console.error('Get Language Preference Error:', error);
        res.status(500).json({ message: 'Failed to fetch language preference' });
    }
});

// Send reset password email
router.post('/send-reset-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email: { $eq: email } });
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
            resetPasswordToken: { $eq: token },
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

// Change password (requires current password)
router.post('/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'User ID, current password, and new password are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// Delete user account
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete Account Error:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

// Get user's premium status
router.get('/premium-status/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is premium and premium hasn't expired
        const isPremium = user.isPremium && (!user.premiumExpiry || user.premiumExpiry > Date.now());

        console.log('Premium status check:', {
            userId: user._id,
            isPremium: user.isPremium,
            premiumExpiry: user.premiumExpiry,
            finalStatus: isPremium
        });

        res.status(200).json({ isPremium });
    } catch (error) {
        console.error('Premium Status Check Error:', error);
        res.status(500).json({ message: 'Failed to check premium status' });
    }
});

// Clear user's course progress
router.post('/clear-progress/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Clear course progress
        user.courseProgress = [];
        await user.save();

        res.status(200).json({ message: 'Course progress cleared successfully' });
    } catch (error) {
        console.error('Clear Progress Error:', error);
        res.status(500).json({ message: 'Failed to clear course progress' });
    }
});

// Update user points
router.post('/:userId/points', async (req, res) => {
    try {
        const { userId } = req.params;
        const { points, reason } = req.body;

        console.log('Received points update request:', { userId, points, reason });

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid User ID:', userId);
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { totalPoints: points } }, 
            { new: true } 
        );

        if (!updatedUser) {
            console.error('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated user points:', updatedUser.totalPoints);

        res.status(200).json({
            message: 'Points updated successfully',
            totalPoints: updatedUser.totalPoints
        });
    } catch (err) {
        console.error('Error updating user points:', err);
        console.error('Error details:', {
            message: err.message,
            stack: err.stack
        });
        res.status(500).json({ error: err.message });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.status(200).send('User route is working!');
});

// Follow a user
router.post('/follow', async (req, res) => {
    try {
        const { followerId, followedId } = req.body;

        if (!followerId || !followedId) {
            return res.status(400).json({ message: 'Follower and followed IDs are required' });
        }

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(followerId) || !mongoose.Types.ObjectId.isValid(followedId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Convert string IDs to MongoDB ObjectIds
        const followerObjectId = new mongoose.Types.ObjectId(followerId);
        const followedObjectId = new mongoose.Types.ObjectId(followedId);

        if (followerObjectId.equals(followedObjectId)) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        // Find both users
        const [follower, followed] = await Promise.all([
            User.findById(followerObjectId),
            User.findById(followedObjectId)
        ]);

        if (!follower || !followed) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already following
        const isAlreadyFollowing = follower.following.some(id => id.equals(followedObjectId));
        if (isAlreadyFollowing) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // Update both users
        follower.following.push(followedObjectId);
        follower.followingCount += 1;
        followed.followers.push(followerObjectId);
        followed.followerCount += 1;

        // Save both users
        await Promise.all([follower.save(), followed.save()]);

        res.status(200).json({ 
            message: 'Successfully followed user',
            followerCount: followed.followerCount,
            followingCount: follower.followingCount
        });
    } catch (error) {
        console.error('Follow user error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export default router;
