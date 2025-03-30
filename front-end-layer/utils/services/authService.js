/**
 * @file authService.js
 * @description Authentication related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, USER_ID_KEY } from '../config';

// User session management
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

export const sendVerificationCode = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/send-verification`, {
      email,
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send verification code');
  }
};

export const verifyCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/verify-code`, {
      email,
      code
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid verification code');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/send-reset-password`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Unable to find an account with this email. Please check if the email is correct or try signing up.');
    }
    throw new Error(error.response?.data?.message || 'Failed to process forgot password request');
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
          'Accept': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Invalid or expired reset token');
    }
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
}; 