import { api } from './api';

export const productService = {
  getProducts: async () => {
    try {
      const response = await api.get('/public/products');
      // The backend returns a Page or List structure, assuming response.data holds the array
      // based on standard DTO wrapper format (e.g. { data: [...] }) or just an array
      return response.data || response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/public/products/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await api.get(`/public/products/search?query=${query}`);
      return response.data || response;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      // Assuming a categories endpoint exists, otherwise we'll infer from products or fetch if needed.
      // E.g. /public/categories
      const response = await api.get('/public/categories').catch(() => null);
      return response?.data || response || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  getBrands: async () => {
    try {
      const response = await api.get('/public/brands').catch(() => null);
      return response?.data || response || [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }
};
