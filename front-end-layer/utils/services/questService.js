/**
 * @file questService.js
 * @description Quest related services
 * @datecreated 31.03.2025
 * @lastmodified 31.03.2025
 */

import axios from 'axios';
import { API_BASE_URL } from '../config';

export const fetchQuests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quests`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch quests');
  }
};

export const fetchCompletedQuests = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quests/users/${userId}/completed-quests`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch completed quests');
  }
};

export const completeQuest = async (questId, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quests/${questId}/complete`, {
      userId: userId
    }, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to complete quest');
  }
};

export const collectQuestReward = async (questId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}/collect-reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ userId }),
      timeout: 10000
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to collect quest reward');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to collect quest reward');
  }
}; 