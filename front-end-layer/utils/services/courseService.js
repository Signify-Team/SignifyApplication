/**
 * @file courseService.js
 * @description Course related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getUserId } from './authService';

export const fetchUserCourses = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.get(`${API_BASE_URL}/courses/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user courses');
  }
};

export const updateCourseProgress = async (courseId, progress, completed = false) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.post(`${API_BASE_URL}/courses/user/${userId}/progress`, {
      courseId,
      progress,
      completed,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update course progress');
  }
};

export const fetchCourseExercises = async (courseId) => {
  try {
    console.log('Fetching exercises for course:', courseId);
    const response = await axios.get(`${API_BASE_URL}/exercises/course/${courseId}`);
    console.log('Raw exercise response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching course exercises:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch course exercises');
  }
};
