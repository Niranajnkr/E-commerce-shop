/**
 * Authentication utility functions
 */

import apiClient from './apiClient';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Response data
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/api/user/register', userData);
    if (response && response.data) {
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Registration successful! Please login to continue.'
      };
    }
    return {
      success: false,
      message: 'Invalid response from server'
    };
  } catch (error) {
    console.error('Registration failed:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Registration failed. Please try again.'
    };
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<Object>} User data if authenticated, null otherwise
 */
export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/api/user/is-auth');
    if (response && response.data && response.data.user) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Response data
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/user/login', { email, password });
    if (response && response.data) {
      return {
        success: response.data.success || true,
        data: response.data,
        message: response.data.message
      };
    }
    return {
      success: false,
      message: 'Invalid response from server'
    };
  } catch (error) {
    console.error('Login failed:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Login failed. Please try again.'
    };
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Response data
 */
export const logout = async () => {
  try {
    await apiClient.post('/api/user/logout');
    return { success: true };
  } catch (error) {
    console.error('Logout failed:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Logout failed. Please try again.'
    };
  }
};

/**
 * Refresh access token
 * @returns {Promise<string|null>} New access token or null if refresh failed
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/api/user/refresh-token');
    return response.data.accessToken || null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};
