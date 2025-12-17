import api from '../api/axios'; 

export const loginUser = async (username, password) => {
    try {
        // CHANGED: Sending 'username' (Roll No) instead of 'email'
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed. Please try again.";
    }
};