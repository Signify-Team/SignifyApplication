/**
 * @file badgeAwardService.js
 * @description Frontend service for handling badge awards (without real-time notifications)
 * @datecreated 27.04.2025
 * @lastmodified 27.04.2025
 */

import { fetchUserBadges } from './badgeService';
import axios from 'axios';
import { API_BASE_URL } from '../config';


export const triggerCourseCompletedBadgeCheck = async (userId, courseId) => {
  try {
    await axios.post(`${API_BASE_URL}/badges/check`, {
      userId,
      eventType: 'courseCompleted',
      eventData: { courseId }
    });
    console.log('Badge check triggered for course completion');
  } catch (error) {
    console.error('Error triggering badge check for course completion:', error);
  }
};
