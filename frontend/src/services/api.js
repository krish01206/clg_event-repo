import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL}/api`, // Assuming backend is on port 5000 and base path is /api
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
