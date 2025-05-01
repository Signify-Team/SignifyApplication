/**
 * @file wordService.js
 * @description Word related services
 * @datecreated 21.04.2025
 * @lastmodified 21.04.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getUserId } from './authService';

export const fetchCourseDictionary = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`);
    return response.data.dictionary || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch course dictionary');
  }
};

export const fetchAllUnlockedCourseWords = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    
    const userCoursesResponse = await axios.get(`${API_BASE_URL}/courses/user/${userId}`);
    const allCoursesResponse = await axios.get(`${API_BASE_URL}/courses`);
    const allCourses = allCoursesResponse.data;
    
    const unlockedCourses = userCoursesResponse.data.filter(course => {
      return course.isLocked === false || course.isLocked === "false" || course._id === allCourses[0]?._id;
    });
    
    const nextLockedCourse = allCourses.find(course => 
      !unlockedCourses.some(uc => uc._id === course._id)
    );
    
    const allWords = [];
    
    for (const course of unlockedCourses) {
      const courseResponse = await axios.get(`${API_BASE_URL}/courses/${course._id}`);
      if (courseResponse.data.dictionary) {
        allWords.push(...courseResponse.data.dictionary);
      }
    }
    
    if (nextLockedCourse) {
      const nextCourseResponse = await axios.get(`${API_BASE_URL}/courses/${nextLockedCourse._id}`);
      if (nextCourseResponse.data.dictionary) {
        allWords.push(...nextCourseResponse.data.dictionary);
      }
    }
    
    return allWords;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch unlocked course words');
  }
}; 