/**
 * @file userService.js
 * @description User related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getUserId, clearUserId } from './authService';

export const fetchUserProfile = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.get(`${API_BASE_URL}/users/profile?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }

    const response = await axios.post(
      `${API_BASE_URL}/users/change-password`,
      { userId, currentPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid password');
    }
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

export const deleteAccount = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }

    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
    await clearUserId();
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Account not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};

export const getUserPremiumStatus = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.get(`${API_BASE_URL}/users/premium-status/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching premium status:', error);
    return { isPremium: false };
  }
}; 