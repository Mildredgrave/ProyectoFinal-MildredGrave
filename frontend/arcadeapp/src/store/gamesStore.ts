import { create } from 'zustand';
import type { Game } from '../types';
import { gamesAPI } from '../services/api';

interface GamesState {
  games: Game[];
  isLoading: boolean;
  fetchGames: () => Promise<void>;
  addGame: (game: Omit<Game, '_id' | 'createdAt'>) => Promise<void>;
  updateGame: (id: string, game: Partial<Game>) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
}

export const useGamesStore = create<GamesState>((set, get) => ({
  games: [],
  isLoading: false,

  fetchGames: async () => {
    set({ isLoading: true });
    try {
      const response = await gamesAPI.getAll();
      set({ games: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addGame: async (gameData) => {
    try {
      const response = await gamesAPI.create(gameData);
      set({ games: [...get().games, response.data] });
    } catch (error) {
      throw error;
    }
  },

  updateGame: async (id, gameData) => {
    try {
      const response = await gamesAPI.update(id, gameData);
      const updatedGames = get().games.map(game => 
        game._id === id ? response.data : game
      );
      set({ games: updatedGames });
    } catch (error) {
      throw error;
    }
  },

  deleteGame: async (id) => {
    try {
      await gamesAPI.delete(id);
      const filteredGames = get().games.filter(game => game._id !== id);
      set({ games: filteredGames });
    } catch (error) {
      throw error;
    }
  },
}));