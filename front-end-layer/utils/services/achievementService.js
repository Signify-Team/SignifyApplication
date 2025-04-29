/**
 * @file achievementService.js
 * @description Achievement related services
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import axios from 'axios';
import { API_URL } from '../config';
import { getUserId } from './authService';

const achievementService = {
    // Fetch all achievements
    fetchAllAchievements: async () => {
        try {
            const response = await axios.get(`${API_URL}/achievements`);
            return response.data;
        } catch (error) {
            console.error('Error fetching achievements:', error);
            throw error;
        }
    },

    // Fetch user's achievements
    fetchUserAchievements: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/achievements/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            throw error;
        }
    },

    // Collect achievement reward
    collectAchievementReward: async (userId, achievementId) => {
        try {
            const response = await axios.post(`${API_URL}/achievements/users/${userId}/${achievementId}/collect`);
            return response.data;
        } catch (error) {
            console.error('Error collecting achievement reward:', error);
            throw error;
        }
    }
};

export default achievementService; 