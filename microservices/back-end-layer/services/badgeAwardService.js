/**
 * @file badgeAwardService.js
 * @description Service for awarding badges based on user accomplishments
 * @datecreated 27.04.2025
 * @lastmodified 27.04.2025
 */

import User from '../models/UserDB.js';
import Badge from '../models/BadgeDB.js';
import { createNotification } from '../utils/notificationUtils.js';
import mongoose from 'mongoose';

async function awardBadgeToUser(userId, badgeObjectId, badgeName) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error(`User not found: ${userId}`);
            return false;
        }

        const hasBadge = user.badges.some(b => b.badgeId.equals(badgeObjectId));

        if (!hasBadge) {
            user.badges.push({
                badgeId: badgeObjectId,
                dateEarned: new Date(),
            });
            await user.save();
            
            await createNotification('badge', 'New Badge!', `Congratulations! You've earned the "${badgeName}" badge!`, userId);
            console.log(`Awarded badge ${badgeName} to user ${userId}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error awarding badge ${badgeName} to user ${userId}:`, error);
        return false;
    }
}


export async function checkFirstSignMaster(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId provided:", userId);
        return false;
    }

    try {
        const firstSignMasterBadge = await Badge.findOne({ badgeId: 'firstSignMaster' });
        if (!firstSignMasterBadge) {
            console.error("First Sign Master badge not found in database");
            return false;
        }

        const user = await User.findById(userId).select('completedCourses');
        if (user && user.completedCourses && user.completedCourses.length > 0) {
            return await awardBadgeToUser(userId, firstSignMasterBadge._id, firstSignMasterBadge.name);
        }
        
        return false;
    } catch (error) {
        console.error(`Error checking First Sign Master badge for user ${userId}:`, error);
        return false;
    }
}


export async function checkAndAwardBadges(userId, eventType, eventData) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid userId provided to checkAndAwardBadges:", userId);
        return;
    }

    try {
        if (eventType === 'courseCompleted') {
            await checkFirstSignMaster(userId);
        }

    } catch (error) {
        console.error(`Error checking badges for user ${userId} on event ${eventType}:`, error);
    }
} 