/**
 * @file authApi.js
 * @description API service calls mapper for authentication endpoints.
 * @responsibility Wraps Axios calls to /auth endpoints into exportable functions.
 */

import axiosInstance from './axios';

/**
 * Sends a user credentials payload to authenticate and receive a token.
 * @param {object} credentials - User credentials (email, password).
 * @returns {Promise<object>} Authenticated session API response payload.
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

/**
 * Sends a user payload to create a new agent.
 * @param {object} userData - Agent registration details.
 * @returns {Promise<object>} Authenticated session API response.
 */
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

/**
 * Fetches user profile for verification during session restoration.
 * @returns {Promise<object>} Current user authentication profile.
 */
export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
