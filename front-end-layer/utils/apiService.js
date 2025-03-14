import axios from 'axios';
import { API_URL } from '@env';

const API_BASE_URL = API_URL;

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
        return response.data; // Handle the response data
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, { username, email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};
