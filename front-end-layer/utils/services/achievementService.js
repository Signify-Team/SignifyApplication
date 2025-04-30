/**
 * @file achievementService.js
 * @description Achievement related services
 * @datecreated 20.12.2024
 * @lastmodified 20.12.2024
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getUserId } from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAllAchievements = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/achievements`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch all achievements');
    }
};

export const fetchUserAchievements = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }
        const response = await axios.get(`${API_BASE_URL}/achievements/users/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user achievements');
    }
};

export const collectAchievementReward = async (achievementId) => {
    try {
        const userId = await getUserId();

        const response = await fetch(`${API_BASE_URL}/achievements/users/${userId}/${achievementId}/collect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to collect achievement');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const collectDailyReward = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await axios.post(`${API_BASE_URL}/achievements/daily-reward/${userId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.error === 'Reward already collected') {
            const nextAvailableTime = new Date(response.data.nextAvailableTime);
            const hoursSinceLastReward = response.data.hoursSinceLastReward;
            const hoursRemaining = Math.ceil(24 - hoursSinceLastReward);
            throw new Error(`Please wait ${hoursRemaining} more hours before collecting your next daily reward.`);
        }

        return response.data;
    } catch (error) {
        console.error('Error collecting daily reward:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        });
        
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to collect daily reward');
        } else if (error.request) {
            throw new Error('No response from server. Please check your internet connection.');
        } else {
            throw new Error(error.message || 'Failed to collect daily reward');
        }
    }
}; 