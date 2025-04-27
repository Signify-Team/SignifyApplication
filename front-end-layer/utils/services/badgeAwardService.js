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

/**
 * Directly award the First Sign Master badge when a user completes their first course
 * This bypasses the automatic badge check system and directly assigns the badge
 * 
 * @param {string} userId - The user's MongoDB ID
 * @returns {Promise<boolean>} - True if badge was awarded successfully
 */
export const awardFirstSignMasterBadge = async (userId) => {
  try {
    // First, get user data to check if this is their first completed course
    console.log(`Getting user data for badge check: ${userId}`);
    const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
    const userData = userResponse.data;
    
    // Check if the user has at least one completed course
    const completedCourses = userData.courseProgress.filter(course => course.completed === true);
    console.log(`User has ${completedCourses.length} completed courses`);
    
    if (completedCourses.length < 1) {
      console.log('User has no completed courses yet');
      return false;
    }
    
    // Get all badges to find the First Sign Master badge
    console.log('Fetching available badges...');
    try {
      const badgesResponse = await axios.get(`${API_BASE_URL}/badges`);
      console.log('Badges response:', badgesResponse.status);
      const badges = badgesResponse.data;
      console.log(`Found ${badges.length} badges`);
      
      // Log all badges to help debug
      badges.forEach(badge => {
        console.log(`Badge: ${badge.name}, ID: ${badge._id}, badgeId: ${badge.badgeId}`);
      });
      
      // Find the First Sign Master badge by its string badgeId field
      const firstSignMasterBadge = badges.find(badge => 
        badge.badgeId === 'firstSignMaster' || 
        badge.name === 'First Sign Master'
      );
      
      if (!firstSignMasterBadge) {
        console.error('First Sign Master badge not found in badges list');
        console.log('Available badges:', badges.map(b => `${b.name} (${b.badgeId})`));
        
        // If badge doesn't exist, create it
        console.log('Creating First Sign Master badge...');
        try {
          const createResponse = await axios.post(`${API_BASE_URL}/badges`, {
            badgeId: 'firstSignMaster',
            name: 'First Sign Master',
            description: 'Complete your very first course.',
            iconUrl: '/assets/badges/first-sign-master.png'
          });
          
          console.log('Badge created:', createResponse.data);
          // Use the newly created badge's _id
          const newBadge = createResponse.data.badge;
          
          // Award the newly created badge
          const awardResponse = await axios.post(
            `${API_BASE_URL}/badges/users/${userId}/${newBadge._id}`
          );
          console.log('Badge award response:', awardResponse.status);
          return true;
        } catch (createError) {
          console.error('Error creating badge:', createError);
          return false;
        }
      }
      
      console.log(`Found badge: ${firstSignMasterBadge.name} (ID: ${firstSignMasterBadge._id})`);
      
      // Check if user already has this badge
      const hasBadge = userData.badges.some(badge => 
        badge.badgeId === firstSignMasterBadge._id.toString()
      );
      
      if (hasBadge) {
        console.log('User already has First Sign Master badge');
        return false;
      }
      
      // The badgeId parameter in the route must be a MongoDB ObjectId, not the string badgeId
      const badgeUrl = `${API_BASE_URL}/badges/users/${userId}/${firstSignMasterBadge._id}`;
      console.log(`Awarding badge with POST to: ${badgeUrl}`);
      
      const awardResponse = await axios.post(badgeUrl);
      console.log('Badge award response:', awardResponse.status);
      
      console.log('First Sign Master badge awarded successfully');
      return true;
    } catch (badgeError) {
      console.error('Error fetching or processing badges:', badgeError);
      
      // If we couldn't fetch badges or something else went wrong, create a new badge as fallback
      try {
        console.log('Trying to create badge as a fallback...');
        const createResponse = await axios.post(`${API_BASE_URL}/badges`, {
          badgeId: 'firstSignMaster',
          name: 'First Sign Master',
          description: 'Complete your very first course.',
          iconUrl: '/assets/badges/first-sign-master.png'
        });
        
        if (createResponse.data && createResponse.data.badge) {
          const newBadge = createResponse.data.badge;
          console.log(`Created new badge with ID: ${newBadge._id}`);
          
          // Award the newly created badge
          const awardResponse = await axios.post(
            `${API_BASE_URL}/badges/users/${userId}/${newBadge._id}`
          );
          console.log('Badge award response:', awardResponse.status);
          return true;
        }
      } catch (fallbackError) {
        console.error('Fallback approach failed:', fallbackError);
      }
      
      throw badgeError;
    }
  } catch (error) {
    console.error('Error awarding First Sign Master badge:', error);
    return false;
  }
};

/**
 * Call this function whenever a course is completed
 * Will handle both the automatic badge check and direct badge assignment as fallback
 * 
 * @param {string} userId - The user's MongoDB ID
 * @param {string} courseId - The completed course's ID
 */
export const handleCourseCompletion = async (userId, courseId) => {
  try {
    // First try the automatic badge check
    await triggerCourseCompletedBadgeCheck(userId, courseId);
    
    // Then directly award the badge as a fallback
    await awardFirstSignMasterBadge(userId);
  } catch (error) {
    console.error('Error handling course completion:', error);
  }
};
