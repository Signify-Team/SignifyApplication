import axios from 'axios';
import { Platform, Alert } from 'react-native';

// Tried multiple IP addresses in case one doesn't work
const API_URLS = [
  'http://172.20.10.6:3000/api', // change to you own local ip address
  'http://169.254.238.213:3000/api',
  'http://localhost:3000/api'
];

let currentUrlIndex = 0;
let API_BASE_URL = API_URLS[currentUrlIndex];

const showError = (message, details) => {
  Alert.alert(
    'Network Error',
    `${message}\n\nDetails: ${JSON.stringify(details, null, 2)}`,
    [{ text: 'OK' }]
  );
};

const switchToNextUrl = () => {
  currentUrlIndex = (currentUrlIndex + 1) % API_URLS.length;
  API_BASE_URL = API_URLS[currentUrlIndex];
  console.log('Switching to next API URL:', API_BASE_URL);
  Alert.alert('Switching API URL', `Trying next URL: ${API_BASE_URL}`);
  return API_BASE_URL;
};

const tryRequest = async (requestFn, maxRetries = API_URLS.length) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      Alert.alert('Attempting Connection', `Trying URL: ${API_BASE_URL}`);
      console.log('Attempting request with URL:', API_BASE_URL);
      const result = await requestFn();
      console.log('Request successful');
      return result;
    } catch (error) {
      console.error('Request failed with URL:', API_BASE_URL);
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      };
      console.error('Error details:', errorDetails);
      showError(`Failed to connect to ${API_BASE_URL}`, errorDetails);
      lastError = error;
      switchToNextUrl();
    }
  }
  throw lastError;
};

export const loginUser = async (email, password) => {
  console.log('Attempting to log in user:', email);
  return tryRequest(async () => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });
    return response.data;
  });
};

export const registerUser = async (username, email, password) => {
  console.log('Attempting to register user:', username);
  return tryRequest(async () => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      username,
      email,
      password,
    });
    return response.data;
  });
};
