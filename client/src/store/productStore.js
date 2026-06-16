import { create } from 'zustand';
import {
  shopProducts,
  filterProducts,
  getProductBySlug,
  getRelatedProducts,
} from '../utils/products.js';

export const useProductStore = create((set, get) => ({
  products: [],
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
  loading: false,
  error: null,
  activeProduct: null,
  relatedProducts: [],

  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const page = Number(filters.page) || 1;
      const limit = Number(filters.limit) || 9;
      const filtered = filterProducts(shopProducts, filters);
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      set({
        products: paginated,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
        currentPage: page,
        totalProducts: filtered.length,
        loading: false,
      });
    } catch (err) {
      set({ error: 'Failed to load products', loading: false });
    }
  },

  fetchProductDetails: async (idOrSlug) => {
    set({ loading: true, error: null, activeProduct: null, relatedProducts: [] });
    try {
      const product = getProductBySlug(idOrSlug);
      if (!product) {
        set({ error: 'Product not found', loading: false });
        return null;
      }
      const related = getRelatedProducts(product, 4);
      set({ activeProduct: product, relatedProducts: related, loading: false });
      return product;
    } catch (err) {
      set({ error: 'Failed to fetch details', loading: false });
      return null;
    }
  },
}));
