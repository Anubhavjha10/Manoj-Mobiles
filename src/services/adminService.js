import { api } from './api';

export const adminService = {
  // --- Orders ---
  getOrders: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/admin/orders?page=${page}&size=${size}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status, note = "") => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status, note });
      return response.data || response;
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      throw error;
    }
  },

  // --- Users ---
  getUsers: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&size=${size}`);
      return response.data || response;
    } catch (error) {
      console.warn('Backend endpoint /admin/users not available yet:', error.message);
      return { content: [], totalElements: 0 };
    }
  },

  // --- Returns ---
  getReturns: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/admin/returns?page=${page}&size=${size}`);
      return response.data || response;
    } catch (error) {
      console.warn('Backend endpoint /admin/returns not available yet:', error.message);
      return { content: [], totalElements: 0 };
    }
  },

  updateReturnStatus: async (returnId, status, note = "") => {
    try {
      const response = await api.put(`/admin/returns/${returnId}/status`, { status, adminNote: note });
      return response.data || response;
    } catch (error) {
      console.error(`Error updating return ${returnId}:`, error);
      throw error;
    }
  },

  // --- Products (Admin) ---
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // --- Delivery Agents ---
  getDeliveryAgents: async () => {
    try {
      const response = await api.get(`/admin/delivery-agents`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }
};
