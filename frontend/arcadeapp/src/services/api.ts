import axios from 'axios';
import type { Game, User, Score, AuthResponse, CartItem } from '../types';


const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post<AuthResponse>('/auth/login', { email, password }),
  
  register: (email: string, name: string, password: string) => 
    api.post<AuthResponse>('/auth/register', { email, name, password }),
  
  getProfile: () => api.get<User>('/auth/profile'),
};

export const gamesAPI = {
  // Con baseURL en .../api, esta llamada irá a GET /api/games
  getAll: () => api.get<Game[]>('/games'),
  getById: (id: string) => api.get<Game>(`/games/${id}`),
  create: (game: Omit<Game, '_id' | 'createdAt'>) => api.post<Game>('/games', game),
  update: (id: string, game: Partial<Game>) => api.put<Game>(`/games/${id}`, game),
  delete: (id: string) => api.delete(`/games/${id}`),
};

export const cartAPI = {
  getCart: () => api.get<CartItem[]>('/cart'),
  addToCart: (gameId: string) => api.post('/cart', { gameId }),
  removeFromCart: (gameId: string) => api.delete(`/cart/${gameId}`),
  clearCart: () => api.delete('/cart'),
  checkout: () => api.post('/cart/checkout'),
};

export const purchasesAPI = {
  // Añade un juego (gratis) directamente a la biblioteca del usuario
  addPurchasedGame: (gameId: string) => api.post('/purchases', { gameId }),
};

export const scoresAPI = {
  getTopScores: (gameId: string) => api.get<Score[]>(`/scores/top/${gameId}`),
  submitScore: (gameId: string, score: number) => 
    api.post<Score>('/scores', { gameId, score }),
};

export default api;