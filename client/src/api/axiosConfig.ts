import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.DEV
        ? 'http://localhost:5010/api'
        : import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;