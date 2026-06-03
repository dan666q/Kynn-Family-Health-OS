import { create } from 'zustand';
import { User, AuthState } from '../types/auth.types';

interface AuthActions {
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const MOCK_USER: User = {
  id: 'user-lan-123',
  email: 'lan.hoang@kynn.vn',
  name: 'Lê Hoàng Lan',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  provider: 'google',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: MOCK_USER, // Authenticated by default for mock UI
  isAuthenticated: true,
  token: 'mock-jwt-token-xyz',
  
  login: (email, name) => set({
    user: {
      id: 'user-lan-123',
      email,
      name,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      provider: 'google',
      createdAt: new Date().toISOString(),
    },
    isAuthenticated: true,
    token: 'mock-jwt-token-xyz',
  }),
  
  logout: () => set({ user: null, isAuthenticated: false, token: null }),
  
  updateProfile: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),
}));

export default useAuthStore;
