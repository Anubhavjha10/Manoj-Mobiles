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

  trackOrderLocation: async (orderId) => {
    try {
      const response = await api.get(`/user/orders/${orderId}/track`);
      return response.data || response;
    } catch (error) {
      console.error(`Error tracking order ${orderId}:`, error);
      throw error;
    }
  },

  assignAgentToOrder: async (orderId, agentId) => {
    try {
      const response = await api.post(`/admin/orders/${orderId}/assign-agent`, { agentId });
      return response.data || response;
    } catch (error) {
      console.error(`Error assigning agent to order ${orderId}:`, error);
      throw error;
    }
  },

  // --- Users ---
  getUsers: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&size=${size}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching users:', error);
      return { content: [], totalElements: 0 };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post(`/admin/users/create`, userData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // --- Returns ---
  getReturns: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/admin/returns?page=${page}&size=${size}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching returns:', error);
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

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
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

  createVariant: async (variantData) => {
    try {
      const response = await api.post('/products/variants', variantData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating variant:', error);
      throw error;
    }
  },

  updateVariant: async (variantId, variantData) => {
    try {
      const response = await api.put(`/products/variants/${variantId}`, variantData);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating variant ${variantId}:`, error);
      throw error;
    }
  },

  deleteVariant: async (variantId) => {
    try {
      const response = await api.delete(`/products/variants/${variantId}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting variant ${variantId}:`, error);
      throw error;
    }
  },

  addVariantSpecifications: async (variantId, specsArray) => {
    try {
      const response = await api.post(`/products/variants/${variantId}/specifications`, specsArray);
      return response.data || response;
    } catch (error) {
      console.error(`Error adding specs to variant ${variantId}:`, error);
      throw error;
    }
  },

  deleteSpecification: async (specId) => {
    try {
      const response = await api.delete(`/products/specifications/${specId}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting specification ${specId}:`, error);
      throw error;
    }
  },

  adjustInventory: async (variantId, data) => {
    try {
      const response = await api.post(`/products/variants/${variantId}/inventory`, data);
      return response.data || response;
    } catch (error) {
      console.error(`Error adjusting inventory for variant ${variantId}:`, error);
      throw error;
    }
  },

  addVariantImages: async (variantId, imageUrlsArray) => {
    try {
      const response = await api.post(`/products/variants/${variantId}/images`, imageUrlsArray);
      return response.data || response;
    } catch (error) {
      console.error(`Error adding images to variant ${variantId}:`, error);
      throw error;
    }
  },

  deleteImage: async (imageId) => {
    try {
      const response = await api.delete(`/products/images/${imageId}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting image ${imageId}:`, error);
      throw error;
    }
  },

  // --- Delivery Agents ---
  getDeliveryAgents: async (page = 0, size = 20) => {
    try {
      const response = await api.get(`/admin/delivery-agents?page=${page}&size=${size}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  },

  createDeliveryAgent: async (agentData) => {
    try {
      const response = await api.post('/admin/delivery-agents', agentData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating delivery agent:', error);
      throw error;
    }
  },

  updateDeliveryAgent: async (agentId, agentData) => {
    try {
      const response = await api.put(`/admin/delivery-agents/${agentId}`, agentData);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating agent ${agentId}:`, error);
      throw error;
    }
  },

  deleteDeliveryAgent: async (agentId) => {
    try {
      const response = await api.delete(`/admin/delivery-agents/${agentId}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting agent ${agentId}:`, error);
      throw error;
    }
  },

  // --- Categories & Brands ---
  createCategory: async (data) => {
    try {
      const response = await api.post('/categories', data);
      return response.data || response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  createBrand: async (data) => {
    try {
      const response = await api.post('/brands', data);
      return response.data || response;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  updateBrand: async (id, data) => {
    try {
      const response = await api.put(`/brands/${id}`, data);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating brand ${id}:`, error);
      throw error;
    }
  },

  deleteBrand: async (id) => {
    try {
      const response = await api.delete(`/brands/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error deleting brand ${id}:`, error);
      throw error;
    }
  }
};
