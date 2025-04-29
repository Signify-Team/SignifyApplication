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


export const awardFirstSignMasterBadge = async (userId) => {
  try {
    // First, check if the badge exists
    const badgesResponse = await axios.get(`${API_BASE_URL}/badges`);
    const badges = badgesResponse.data;
    
    let firstSignMasterBadge = badges.find(badge => 
      badge.badgeId === 'firstSignMaster' || 
      badge.name === 'First Sign Master'
    );
    
    // If badge doesn't exist, create it
    if (!firstSignMasterBadge) {
      console.log('First Sign Master badge not found, creating new badge');
      const createResponse = await axios.post(`${API_BASE_URL}/badges`, {
        badgeId: 'firstSignMaster',
        name: 'First Sign Master',
        description: 'Complete your very first course.',
        iconUrl: 'https://signifyappbucket.s3.eu-north-1.amazonaws.com/BADGE_DATA/First-Sign-Master.png'
      });
      
      if (createResponse.data && createResponse.data.badge) {
        firstSignMasterBadge = createResponse.data.badge;
      } else {
        console.error('Failed to create badge:', createResponse.data);
        return false;
      }
    }
    
    // Now try to award the badge
    try {
      const awardResponse = await axios.post(
        `${API_BASE_URL}/badges/users/${userId}/${firstSignMasterBadge._id}`
      );
      
      if (awardResponse.data && awardResponse.data.message === 'Badge added to user successfully') {
        console.log('Successfully awarded First Sign Master badge');
        return true;
      } else {
        console.error('Unexpected response when awarding badge:', awardResponse.data);
        return false;
      }
    } catch (awardError) {
      if (awardError.response?.status === 400 && 
          awardError.response?.data?.error === 'User already has this badge') {
        console.log('User already has the First Sign Master badge');
        return true;
      }
      console.error('Error awarding badge:', awardError.response?.data || awardError);
      return false;
    }
  } catch (error) {
    console.error('Error in awardFirstSignMasterBadge:', error.response?.data || error);
    return false;
  }
};


export const handleCourseCompletion = async (userId, courseId) => {
  try {
    await triggerCourseCompletedBadgeCheck(userId, courseId);
    await awardFirstSignMasterBadge(userId);
  } catch (error) {
    console.error('Error handling course completion:', error);
  }
};
