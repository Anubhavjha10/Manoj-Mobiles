import { api, setToken, getToken, setRefreshToken, setUserId } from './api';

export const authService = {
  customerLogin: async (phone, otp) => {
    try {
      const response = await api.post('/auth/login', { phone, otp });
      const data = response?.data || response;
      
      const token = data?.token || data?.accessToken;
      const refreshToken = data?.refreshToken;
      const userId = data?.user?.id;

      if (token) setToken(token);
      if (refreshToken) setRefreshToken(refreshToken);
      if (userId) setUserId(userId);
      
      return data;
    } catch (error) {
      console.error('Customer Login failed:', error);
      throw error;
    }
  },

  sendOtp: async (phone) => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return response?.data || response;
    } catch (error) {
      console.error('Send OTP failed:', error);
      throw error;
    }
  },

  staffLogin: async (email, password) => {
    try {
      const response = await api.post('/auth/staff/login', { email, password });
      const data = response?.data || response;
      
      const token = data?.token || data?.accessToken;
      const refreshToken = data?.refreshToken;
      const userId = data?.user?.id;

      if (token) setToken(token);
      if (refreshToken) setRefreshToken(refreshToken);
      if (userId) setUserId(userId);
      
      return data;
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
    setRefreshToken(null);
    setUserId(null);
    localStorage.removeItem('mm_user');
    localStorage.removeItem('mm_admin_user');
  },

  isAuthenticated: () => {
    return !!getToken();
  }
};
