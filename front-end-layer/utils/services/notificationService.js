/**
 * @file notificationService.js
 * @description Notification related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getUserId } from './authService';

export const fetchUserNotifications = async () => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.get(`${API_BASE_URL}/notifications/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const createNotification = async (type, title, message) => {
  try {
    const userId = await getUserId();
    if (!userId) {
      throw new Error('No user ID found. Please log in again.');
    }
    const response = await axios.post(`${API_BASE_URL}/notifications`, {
      userId,
      type,
      title,
      message
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create notification');
  }
};

export const markNotificationAsRead = async (notification) => {
  try {
    console.log('Marking notification as read:', notification);
    const notificationId = notification._id || notification.id;
    if (!notificationId) {
      throw new Error('Notification ID is missing');
    }
    console.log('API URL:', `${API_BASE_URL}/notifications/${notificationId}/read`);
    
    const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
    console.log('Mark as read response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Full error marking notification as read:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      notification: notification
    });
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

export const deleteNotification = async (notification) => {
  try {
    const notificationId = notification._id || notification.id;
    if (!notificationId) {
      throw new Error('Notification ID is missing');
    }
    const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
}; 