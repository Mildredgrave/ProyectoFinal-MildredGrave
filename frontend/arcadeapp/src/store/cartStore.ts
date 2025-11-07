import { create } from 'zustand';
import type { CartItem, Game } from '../types';
import { cartAPI, purchasesAPI } from '../services/api';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (game: Game) => Promise<void>;
  removeFromCart: (gameId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartAPI.getCart();
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addToCart: async (game: Game) => {
    try {
      // Si el juego es gratis, se añade directamente
      if ((game as any).isFree) {
        await purchasesAPI.addPurchasedGame(game._id);
        // No hay cambios en el carrito por tratarse de una compra gratuita
        return;
      }

      await cartAPI.addToCart(game._id);
      await get().fetchCart();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al agregar al carrito');
    }
  },

  removeFromCart: async (gameId: string) => {
    try {
      await cartAPI.removeFromCart(gameId);
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await cartAPI.clearCart();
      set({ items: [] });
    } catch (error) {
      throw error;
    }
  },

  checkout: async () => {
    try {
      const response = await cartAPI.checkout();
      set({ items: [] });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el checkout');
    }
  },

  getTotal: () => {
    return get().items.reduce((total, item) => {
      return total + (item.game.price * item.quantity);
    }, 0);
  },
}));