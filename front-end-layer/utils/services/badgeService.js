/**
 * @file badgeService.js
 * @description Badge related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

export const fetchUserBadges = async (badgeIds) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/badges/batch`, {
      params: { badgeIds: badgeIds.join(',') }
    });
    
    // Get pre-signed URLs for all badge icons
    const badges = response.data;
    const badgesWithSignedUrls = await Promise.all(
      badges.map(async (badge) => {
        try {
          const iconResponse = await axios.get(`${API_BASE_URL}/badges/icon/${badge._id}`);
          return {
            ...badge,
            iconUrl: iconResponse.data.signedUrl
          };
        } catch (error) {
          console.error(`Failed to get signed URL for badge ${badge._id}:`, error);
          return badge;
        }
      })
    );
    
    return badgesWithSignedUrls;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user badges');
  }
};

export const fetchAllBadges = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/badges`);
    
    // Get pre-signed URLs for all badge icons
    const badges = response.data;
    const badgesWithSignedUrls = await Promise.all(
      badges.map(async (badge) => {
        try {
          const iconResponse = await axios.get(`${API_BASE_URL}/badges/icon/${badge._id}`);
          return {
            ...badge,
            iconUrl: iconResponse.data.signedUrl
          };
        } catch (error) {
          console.error(`Failed to get signed URL for badge ${badge._id}:`, error);
          return badge;
        }
      })
    );
    
    return badgesWithSignedUrls;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all badges');
  }
}; 