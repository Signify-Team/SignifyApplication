/**
 * @file streakService.js
 * @description Handles all streak-related operations
 * 
 * @datecreated 29.04.2025
 * @lastmodified 29.04.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Updates the user's streak count when they complete a course
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} - Response containing streak count and message
 */
export const updateStreakCount = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/update-streak`, {
            userId
        });
        return response.data;
    } catch (error) {
        console.error('Error updating streak count:', error);
        throw error;
    }
};

/**
 * Gets the user's current streak count
 * @param {string} userId - User's ID
 * @returns {Promise<number>} - Current streak count
 */
export const getStreakCount = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/streak`);
        return response.data.streakCount;
    } catch (error) {
        console.error('Error getting streak count:', error);
        throw error;
    }
};

export const checkStreakLoss = async () => {
    try {
        const userId = await getUserId();
        if (!userId) return false;

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        const user = response.data;

        if (!user.lastCourseCompletionDate) return false;

        const lastCompletionDate = new Date(user.lastCourseCompletionDate);
        const currentDate = new Date();

        // Convert to UTC dates for comparison
        const lastUTCDate = new Date(Date.UTC(
            lastCompletionDate.getUTCFullYear(),
            lastCompletionDate.getUTCMonth(),
            lastCompletionDate.getUTCDate()
        ));
        const currentUTCDate = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate()
        ));
        const yesterdayUTCDate = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate() - 1
        ));

        // Check if the last completion was before yesterday
        return lastUTCDate.getTime() < yesterdayUTCDate.getTime();
    } catch (error) {
        console.error('Error checking streak loss:', error);
        return false;
    }
}; 