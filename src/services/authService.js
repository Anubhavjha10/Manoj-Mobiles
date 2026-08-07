import { api, setToken, getToken } from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const token = response?.data?.token || response?.token;
      if (token) {
        setToken(token);
      }
      
      return response.data || response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  staffLogin: async (email, password) => {
    try {
      const response = await api.post('/auth/staff/login', { email, password });
      
      const token = response?.data?.token || response?.token;
      if (token) {
        setToken(token);
      }
      
      return response.data || response;
    } catch (error) {
      console.error('Staff Login failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data || response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  logout: () => {
    setToken(null);
    localStorage.removeItem('mm_user');
  },

  isAuthenticated: () => {
    return !!getToken();
  }
};
