import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 

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
