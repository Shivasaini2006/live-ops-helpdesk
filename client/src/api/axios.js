/**
 * @file axios.js
 * @description Configures and exports a centralized Axios instance.
 * @responsibility Sets base URL, content-type headers, and defines request/response interceptors to attach authorization (JWT) headers automatically from localStorage.
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Vite proxy routes /api requests to port 5000 in development
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to append authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired sessions
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
