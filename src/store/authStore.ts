import { create } from 'zustand';
import { User } from '@/types';
import { secureStorage } from '@/utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user: User) =>
    set(() => ({
      user,
      isAuthenticated: true,
      isLoading: false,
    })),

  logout: async () => {
    // Clear secure storage
    await secureStorage.clearTokens();

    set(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }));
  },

  setLoading: (isLoading: boolean) => set(() => ({ isLoading })),

  // Initialize auth state from secure storage
  initializeAuth: async () => {
    try {
      set(() => ({ isLoading: true }));

      const [isAuthenticated, userData] = await Promise.all([
        secureStorage.isAuthenticated(),
        secureStorage.getUserData(),
      ]);

      if (isAuthenticated && userData) {
        set(() => ({
          user: userData as User,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        set(() => ({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set(() => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  },
}));
