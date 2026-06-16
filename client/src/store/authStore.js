import { create } from 'zustand';
import api from '../services/api.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('macros_token') || null,
  loading: false,
  error: null,

  init: async () => {
    const { token } = get();
    if (!token) return;

    set({ loading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, loading: false });
    } catch (err) {
      set({ user: null, token: null, loading: false });
      localStorage.removeItem('macros_token');
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('macros_token', token);
      set({ user: userData, token, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response
        ? err.response.data?.message || err.response.data?.errors?.[0]?.msg || 'Registration failed'
        : 'Cannot reach the server. Please start the backend and try again.';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('macros_token', token);
      set({ user: userData, token, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      return { success: false, message: msg };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed: ', err);
    }
    localStorage.removeItem('macros_token');
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null })
}));
