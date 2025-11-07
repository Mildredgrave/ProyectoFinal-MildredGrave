export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  purchasedGames: string[];
}

export interface Game {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isFree: boolean;
  iconUrl: string;
  createdAt: string;
}

export interface CartItem {
  game: Game;
  quantity: number;
}

export interface Score {
  _id: string;
  user: { name: string };
  game: string;
  score: number;
  date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}