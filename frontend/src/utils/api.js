import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.accessToken) {
          config.headers.Authorization = `Bearer ${authData.state.accessToken}`;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const token = localStorage.getItem('auth-storage');
      if (token) {
        try {
          const authData = JSON.parse(token);
          if (authData.state?.refreshToken) {
            const response = await axios.post('/api/auth/refresh-token', {
              refreshToken: authData.state.refreshToken
            });
            const newToken = response.data.accessToken;
            // Update stored token
            const updatedAuth = {
              ...authData,
              state: {
                ...authData.state,
                accessToken: newToken
              }
            };
            localStorage.setItem('auth-storage', JSON.stringify(updatedAuth));
            // Retry original request
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          // Refresh failed, clear auth
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
