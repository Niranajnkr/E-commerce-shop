import axios from 'axios';

// Global state for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Important: This is needed for CORS with credentials
  withCredentials: true,
  // Add this to handle CORS properly
  crossDomain: true,
  // Add this to include credentials in CORS requests
  credentials: 'include',
});

// Add a request interceptor to include the token in every request
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is due to expired token and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (data.success) {
          // Update the default Authorization header
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          
          // Process queued requests
          processQueue(null, data.accessToken);
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        processQueue(refreshError, null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
