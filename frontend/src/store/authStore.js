import { create } from 'zustand';
import api from '../utils/api';

// Simple persistence helper
const loadAuth = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveAuth = (state) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify({
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken
    }));
  } catch {
    // Ignore storage errors
  }
};

const useAuthStore = create((set, get) => {
  // Load initial state from localStorage
  const saved = loadAuth();
  
  return {
      user: saved?.user || null,
      accessToken: saved?.accessToken || null,
      refreshToken: saved?.refreshToken || null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            loading: false,
            error: null
          });
          // Set token in axios defaults
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          saveAuth({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          });
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.error || 'Login failed'
          });
          throw error;
        }
      },

      register: async (email, password, username, full_name) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', {
            email,
            password,
            username,
            full_name
          });
          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            loading: false,
            error: null
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          saveAuth({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          });
          return response.data;
        } catch (error) {
          set({
            loading: false,
            error: error.response?.data?.error || 'Registration failed'
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null
        });
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('auth-storage');
      },

      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData };
        set({ user: updatedUser });
        saveAuth({
          user: updatedUser,
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        });
      },

      initialize: async () => {
        const { accessToken } = get();
        if (accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          try {
            const response = await api.get('/auth/me');
            set({ user: response.data.user });
          } catch (error) {
            // Token invalid, clear auth
            get().logout();
          }
        }
      }
    };
  }
);

export { useAuthStore };
export default useAuthStore;
