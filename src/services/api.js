import axios from 'axios';

const api = axios.create({
  baseURL: 'https://videobackend-x2a9.onrender.com/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
