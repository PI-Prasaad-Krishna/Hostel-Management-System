import api from '../api/axios'; // Make sure you created this file in the previous steps

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed. Please try again.";
    }
};