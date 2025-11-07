import { create } from 'zustand';
import type { User } from '../types';
import { authAPI } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
  const response = await authAPI.login(email, password);
  // El backend de auth devuelve { token, user } en el body
  const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  register: async (email: string, name: string, password: string) => {
    set({ isLoading: true });
    try {
  const response = await authAPI.register(email, name, password);
  // El backend de auth devuelve { token, user } en el body
  const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return;

    try {
  const response = await authAPI.getProfile();
  
  set({ user: response.data });
    } catch (error) {
      get().logout();
    }
  },
}));