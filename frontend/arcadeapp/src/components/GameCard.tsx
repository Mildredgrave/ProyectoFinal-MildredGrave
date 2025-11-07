import React from 'react';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
  onPlay?: () => void;
  onAddToCart?: () => void;
  isPurchased?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  onPlay, 
  onAddToCart, 
  isPurchased 
}) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="px-4 pt-4">
        <img 
          src={game.iconUrl} 
          alt={game.name}
          className="rounded-xl w-full h-auto object-contain"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{game.name}</h2>
        <p className="text-gray-600 line-clamp-2 text-sm">{game.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className={`badge ${game.isFree ? 'badge-success' : 'badge-primary'}`}>
            {game.isFree ? 'Gratis' : `$${game.price}`}
          </span>
          <span className="badge badge-outline">{game.category}</span>
        </div>
        <div className="card-actions justify-end mt-4">
          {isPurchased ? (
            <button className="btn btn-primary btn-sm" onClick={onPlay}>
              Jugar
            </button>
          ) : (
            <button 
              className={`btn ${game.isFree ? 'btn-success' : 'btn-primary'} btn-sm`}
              onClick={onAddToCart}
            >
              {game.isFree ? 'Obtener Gratis' : '🛒 Agregar al Carrito'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};