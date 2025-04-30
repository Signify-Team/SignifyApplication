/**
 * @file courseService.js
 * @description Course related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getUserId } from './authService';
import { updateUserPoints } from './userService';
import { createNotification } from './notificationService';
import { awardFirstSignMasterBadge } from './badgeAwardService';

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
    console.error('Error updating course progress:', error);
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

export const updateCourseCompletion = async (courseId, isPassed) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('No user ID found. Please log in again.');
        }

        // First, complete the course
        const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/finish`, {
            userId,
            isPassed,
            completed: true,
            progress: 100
        });

        if (!response.data) {
            throw new Error('Failed to update course completion');
        }

        // Then handle points and notifications
        if (isPassed) {
            try {
                await Promise.all([
                    updateUserPoints(50, 'Course completion'),
                    createNotification('course', 'Course Completed!', 'Congratulations! You\'ve completed the course with a passing grade!', userId),
                    awardFirstSignMasterBadge(userId)
                ]);
            } catch (error) {
                console.error('Error handling post-completion tasks:', error);
                // Don't fail the completion if these tasks fail
            }
        } else {
            try {
                await createNotification('course', 'Course Completed', 'You\'ve completed the course. Try again to improve your score!', userId);
            } catch (error) {
                console.error('Error creating completion notification:', error);
                // Don't fail the completion if notification fails
            }
        }

        return response.data;
    } catch (error) {
        console.error('Error updating course completion:', error);
        throw new Error(error.response?.data?.message || 'Failed to update course completion');
    }
}; 

export const startPracticeSession = async (courseId) => {
    try {
        const exercises = await fetchCourseExercises(courseId);
        return {
            exercises,
            isPracticeMode: true,
        };
    } catch (error) {
        console.error('Error starting practice session:', error);
        throw new Error(error.response?.data?.message || 'Failed to start practice session');
    }
}; 