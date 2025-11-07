import api from './api';

export const userGamesAPI = {
  removeGame: (gameId: string) => api.delete(`/user-games/${gameId}`),
};

export default userGamesAPI;