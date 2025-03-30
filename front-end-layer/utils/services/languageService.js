/**
 * @file languageService.js
 * @description Language related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getUserId } from './authService';

export const fetchSectionsByLanguage = async (language) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sections/language/${language}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sections for language');
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
      language
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update language preference');
  }
};

export const getUserLanguagePreference = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.get(`${API_BASE_URL}/users/language-preference/${userId}`);
    return response.data.language;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch language preference');
  }
}; 