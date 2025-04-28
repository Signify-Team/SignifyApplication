/**
 * @file badgeService.js
 * @description Badge related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

export const fetchUserBadges = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/badges/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user badges');
  }
};

export const fetchBadgeById = async (badgeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/badges/${badgeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch badge');
  }
}; 