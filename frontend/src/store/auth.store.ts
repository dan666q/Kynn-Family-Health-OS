import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types/auth.types';
import authApi from '../api/auth.api';
import axiosInstance from '../api/axios';

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
  
  login: async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      if (res.status === 'success' && res.data) {
        const token = res.data.token;
        // Set header globally on axios
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({
          user: res.data.user,
          token: token,
          isAuthenticated: true
        });
      }
    } catch (err) {
      delete axiosInstance.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isAuthenticated: false });
      throw err;
    }
  },
  
  register: async (email, password, name) => {
    try {
      const res = await authApi.register(email, password, name);
      if (res.status === 'success' && res.data) {
        const token = res.data.token;
        // Set header globally on axios
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        set({
          user: res.data.user,
          token: token,
          isAuthenticated: true
        });
      }
    } catch (err) {
      delete axiosInstance.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isAuthenticated: false });
      throw err;
    }
  },
  
  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Backend logout failed or token invalid, resetting locally anyway.', err);
    } finally {
      // Clear header globally from axios
      delete axiosInstance.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const { token } = get();
    if (!token) return;

    try {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await authApi.getMe();
      if (res.status === 'success' && res.data) {
        set({ user: res.data.user, isAuthenticated: true });
      }
    } catch (err) {
      console.warn('Session expired or invalid token', err);
      delete axiosInstance.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
    }),
    {
      name: 'kynn-auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useAuthStore;


