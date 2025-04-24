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
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 10000; // 10 seconds timeout

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.user?._id) {
              setUserId(data.user._id)
                .then(() => resolve(data))
                .catch(error => reject(error));
            } else {
              resolve(data);
            }
          } catch (e) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`Server returned status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = function(e) {
      reject(new Error('Network request failed'));
    };

    xhr.ontimeout = function() {
      reject(new Error('Request timed out'));
    };

    try {
      xhr.open('POST', `${API_BASE_URL}/users/login`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', '*/*');
      
      const body = JSON.stringify({
        email,
        password
      });
      
      xhr.send(body);
    } catch (error) {
      reject(error);
    }
  });
};

export const registerUser = async (username, email, password) => {
  try {
    console.log('Attempting to register user:', { username, email });
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      username,
      email,
      password,
    });
    console.log('Registration response:', response.data);
    if (response.data.user?._id) {
      await setUserId(response.data.user._id);
    }
    return response.data;
  } catch (error) {
    console.log('Registration error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 409) {
      if (error.response?.data?.message?.includes('username')) {
        throw new Error('Username already exists. Please choose another username.');
      } else if (error.response?.data?.message?.includes('email')) {
        throw new Error('An account with this email already exists. Please try logging in or use the forgot password option.');
      }
    }
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const checkUserExists = async (username, email) => {
  try {
    console.log('Checking if user exists:', { username, email });
    const response = await axios.post(`${API_BASE_URL}/users/check-exists`, {
      username,
      email
    });
    return response.data;
  } catch (error) {
    console.log('Check user exists error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    if (error.response?.status === 409) {
      if (error.response?.data?.message?.includes('username')) {
        throw new Error('Username already exists. Please choose another username.');
      } else if (error.response?.data?.message?.includes('email')) {
        throw new Error('An account with this email already exists. Please try logging in or use the forgot password option.');
      }
    }
    throw error;
  }
};

export const sendVerificationCode = async (email, username, password) => {
  try {
    // First check if user exists
    await checkUserExists(username, email);
    
    // If no error from checkUserExists, proceed with sending verification
    console.log('Sending verification code for:', { email, username });
    const response = await axios.post(`${API_BASE_URL}/users/send-verification`, {
      email,
      username,
      password
    });
    console.log('Verification code response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Verification code error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error; // Re-throw the error from checkUserExists
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