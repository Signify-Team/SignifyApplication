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
    console.error('Error fetching course dictionary:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch course dictionary');
  }
};

export const fetchAllUnlockedCourseWords = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    
    // get all courses to later get the unlocked ones
    const userCoursesResponse = await axios.get(`${API_BASE_URL}/courses/user/${userId}`);
    const unlockedCourses = userCoursesResponse.data.filter(course => !course.isLocked);
    
    // get the unlocked courses words
    const allWords = [];
    for (const course of unlockedCourses) {
      const courseResponse = await axios.get(`${API_BASE_URL}/courses/${course._id}`);
      if (courseResponse.data.dictionary) {
        allWords.push(...courseResponse.data.dictionary);
      }
    }
    
    // remove duplicates if the same word is in multiple courses
    const uniqueWords = Array.from(new Set(allWords.map(word => word._id)))
      .map(id => allWords.find(word => word._id === id));
    
    return uniqueWords;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch unlocked course words');
  }
}; 