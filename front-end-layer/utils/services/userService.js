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
    console.log('Fetched user profile:', response.data);
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

export const updateUserPoints = async (points, reason) => {
    try {
        const userId = await getUserId();
        console.log('Updating points for user:', userId);
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }

        const response = await axios.post(`${API_BASE_URL}/users/${userId}/points`, {
            points,
            reason
        });

        console.log('Points update response:', response.data); 

        if (!response.data || !response.data.totalPoints) {
            console.error('Invalid response data:', response.data);
            throw new Error('Invalid response from server');
        }

        return response.data.totalPoints;
    } catch (error) {
        console.error('Error updating user points:', error);
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        }); 
        throw new Error(error.response?.data?.message || 'Failed to update user points');
    }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const followUser = async (followedUserId) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.post(`${API_BASE_URL}/users/follow`, {
      followerId: userId,
      followedId: followedUserId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Follow user error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to follow user');
  }
};

export const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
            params: { userId },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Get user profile error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
};

export const unfollowUser = async (followedId) => {
    try {
        const currentUserId = await getUserId();
        if (!currentUserId) {
            throw new Error('No user ID found. Please log in again.');
        }

        const response = await axios.post(`${API_BASE_URL}/users/unfollow`, {
            followerId: currentUserId,
            followedId: followedId
        });

        return response.data;
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
}; 