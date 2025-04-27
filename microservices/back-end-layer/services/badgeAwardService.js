/**
 * @file badgeAwardService.js
 * @description Service for awarding badges based on user accomplishments
 * @datecreated 02.04.2025
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

        // Convert the badgeObjectId to a string to ensure reliable comparison
        const badgeIdStr = badgeObjectId.toString();
        
        // Check if user already has this badge by comparing string representations
        const hasBadge = user.badges.some(b => {
            return b.badgeId.toString() === badgeIdStr;
        });
        
        console.log(`Checking if user already has badge ${badgeName} (${badgeIdStr}):`, hasBadge);

        if (!hasBadge) {
            console.log(`Adding badge ${badgeName} to user ${userId}`);
            user.badges.push({
                badgeId: badgeObjectId,
                dateEarned: new Date(),
            });
            await user.save();
            
            await createNotification('badge', 'New Badge!', `Congratulations! You've earned the "${badgeName}" badge!`, userId);
            console.log(`Awarded badge ${badgeName} to user ${userId}`);
            return true;
        }
        
        console.log(`User already has badge ${badgeName}`);
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
        // Get the badge details - try different ways to find the correct badge
        // Try by badgeId string first, then by name if that fails
        let firstSignMasterBadge = await Badge.findOne({ badgeId: 'firstSignMaster' });
        
        // If not found by badgeId, try by name
        if (!firstSignMasterBadge) {
            firstSignMasterBadge = await Badge.findOne({ name: 'First Sign Master' });
        }
        
        // If still not found, try finding any badge (for debugging)
        if (!firstSignMasterBadge) {
            const allBadges = await Badge.find().limit(1);
            if (allBadges && allBadges.length > 0) {
                firstSignMasterBadge = allBadges[0];
                console.log('Using first available badge instead:', firstSignMasterBadge);
            } else {
                console.error("No badges found in database");
                return false;
            }
        }
        
        console.log('Found badge for award:', firstSignMasterBadge);

        // Check if the user has completed at least one course
        const user = await User.findById(userId).select('courseProgress');
        
        // Check if user has at least one completed course in courseProgress array
        if (user && user.courseProgress && user.courseProgress.some(course => course.completed === true)) {
            console.log('User has completed courses:', user.courseProgress.filter(c => c.completed));
            return await awardBadgeToUser(userId, firstSignMasterBadge._id, firstSignMasterBadge.name);
        } else {
            console.log('User has no completed courses yet');
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