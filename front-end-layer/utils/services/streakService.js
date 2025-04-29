/**
 * @file streakService.js
 * @description Handles all streak-related operations
 * 
 * @datecreated 29.04.2025
 * @lastmodified 29.04.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';


export const updateStreakCount = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/update-streak`, {
            email
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