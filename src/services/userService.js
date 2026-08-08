import { api } from './api';

export const userService = {
  // Profile
  getProfile: async () => {
    const result = await api.get('/users/profile');
    return result?.data || result;
  },

  updateProfile: async (data) => {
    const result = await api.put('/users/profile', data);
    return result?.data || result;
  },

  // Orders
  getOrders: async (page = 0, size = 10) => {
    const result = await api.get(`/user/orders?page=${page}&size=${size}`);
    return result?.data || result;
  },

  getOrderById: async (orderId) => {
    const result = await api.get(`/user/orders/${orderId}`);
    return result?.data || result;
  },

  trackOrderLocation: async (orderId) => {
    const result = await api.get(`/user/orders/${orderId}/track`);
    return result?.data || result;
  },

  // Addresses
  getAddresses: async (page = 0, size = 20) => {
    const result = await api.get(`/user/addresses?page=${page}&size=${size}`);
    return result?.data || result;
  },

  createAddress: async (data) => {
    const result = await api.post('/user/addresses', data);
    return result?.data || result;
  },

  updateAddress: async (id, data) => {
    const result = await api.put(`/user/addresses/${id}`, data);
    return result?.data || result;
  },

  deleteAddress: async (id) => {
    const result = await api.delete(`/user/addresses/${id}`);
    return result?.data || result;
  }
};
