/**
 * @file notificationRoutes.js
 * @description This file handles the notification routes.
 *
 * @datecreated 15.02.2025
 * @lastmodified 18.02.2025
 */

const express = require('express');
const Notification = require('../models/NotificationDB');
const User = require('../models/UserDB'); // Make sure User model is imported
const rateLimit = require('express-rate-limit'); // Import rate limiter
const mongoose = require('mongoose');
const router = express.Router();

// Rate limiter for notification routes
const notificationRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: 'Too many requests from this IP, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiter to all notification routes
router.use(notificationRateLimiter);

// Create a new notification for a user
router.post('/', async (req, res) => {
    const { userId, message } = req.body;

    // Ensure userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }

    try {
        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create the notification object, but don't save it yet
        const newNotification = new Notification({
            userId: new mongoose.Types.ObjectId(userId),
            message: message.trim(),
            notificationId: new mongoose.Types.ObjectId() // Use a new ObjectId for notificationId
        });

        // Save the notification
        const savedNotification = await newNotification.save();

        res.status(201).json({
            message: 'Notification created successfully',
            notification: savedNotification
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    // Ensure userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }

    try {
        const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(userId) });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark a notification as read
router.put('/:id/read', async (req, res) => {
    const { id } = req.params;

    // Ensure the notification ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a notification by its ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Ensure the notification ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid notification ID format' });
    }

    try {
        const deletedNotification = await Notification.findByIdAndDelete(id);
        if (!deletedNotification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
