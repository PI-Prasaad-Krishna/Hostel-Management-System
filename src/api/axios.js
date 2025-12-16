import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Matches your Spring Boot context path
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token automatically
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user'); // Or however you store the token
        if (user) {
            const token = JSON.parse(user).token; // Adjust based on your AuthContext
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;