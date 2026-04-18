import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5010/api', // כתובת השרת שלך
});

// הוספת ה-Token לכל בקשה שיוצאת
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;