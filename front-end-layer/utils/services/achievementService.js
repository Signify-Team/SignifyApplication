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
        console.error('Error collecting achievement:', error);
        throw error;
    }
}; 