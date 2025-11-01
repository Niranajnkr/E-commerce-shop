/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated
 * @returns {Promise<Object>} User data if authenticated, null otherwise
 */
export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/api/user/is-auth');
    return response.data.user || null;
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
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Login failed:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please try again.'
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
