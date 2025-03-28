/**
 * @file apiService.js
 * @description Api Services imported
 * @datecreated 16.12.2024
 * @lastmodified 31.03.2025
 */

export * from './services/authService';
export * from './services/userService';
export * from './services/languageService';
export * from './services/questService';
export * from './services/courseService';
export * from './services/badgeService';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://172.20.10.6:3000/api';

// User session management
const USER_ID_KEY = '@user_id';

export const setUserId = async (userId) => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Error saving user ID:', error);
  }
};

export const getUserId = async () => {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

export const clearUserId = async () => {
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error clearing user ID:', error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });
    if (response.data.user?._id) {
      await setUserId(response.data.user._id);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      username,
      email,
      password,
    });
    if (response.data.user?._id) {
      await setUserId(response.data.user._id);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const fetchSections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sections/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sections');
  }
};

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

export const sendVerificationCode = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/send-verification`, {
      email,
      username,
      password,
    });

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to send verification code');
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/verify-code`, {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid verification code');
  }
};

export const updateLanguagePreference = async (language) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }
        const response = await axios.post(`${API_BASE_URL}/users/update-language`, {
            userId,
            language,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update language preference');
    }
};

export const fetchUserBadges = async (badgeIds) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/badges/batch`, {
            params: { badgeIds: badgeIds.join(',') },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user badges');
    }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/send-reset-password`,
      { email: email },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Unable to find an account with this email. Please check if the email is correct or try signing up.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later');
    } else if (!error.response) {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to process forgot password request');
    }
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/reset-password`,
      { token, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Invalid or expired reset token');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later');
    } else if (!error.response) {
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }
};
