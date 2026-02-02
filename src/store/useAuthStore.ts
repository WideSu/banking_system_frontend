import { create } from 'zustand';
import { Account } from '../types/account';

interface AuthState {
  user: Account | null;
  isAuthenticated: boolean;
  login: (user: Account) => void;
  logout: () => void;
  updateUser: (user: Account) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => {
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  updateUser: (user) => set({ user }),
}));
