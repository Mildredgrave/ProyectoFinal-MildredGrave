import React, { useEffect } from 'react';
import { GameCard } from '../components/GameCard';
import { useGamesStore } from '../store/gamesStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { purchasesAPI } from '../services/api';
import { useToast } from '../components/toast/ToastContext';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const { games, fetchGames } = useGamesStore();
  const { user, checkAuth } = useAuthStore();
  const { addToCart } = useCartStore();
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddToCart = async (game: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (game.isFree) {
        await purchasesAPI.addPurchasedGame(game._id);
        await checkAuth();
        push('¡Juego gratuito agregado a tu biblioteca!', 'success');
      } else {
        await addToCart(game);
        push('¡Juego agregado al carrito!', 'success');
      }
    } catch (error: any) {
      push(error.message || 'Error', 'error');
    }
  };

  const handlePlay = () => {
    navigate('/my-games');
  };

  return (
    <div className="bg-green-0 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            BIENVENIDO A ARCADESTORE
          </h1>
          <p className="text-xl text-white-200">
            Descubre los mejores videojuegos para todas las plataformas
          </p>
        </div>
        
        {games.length === 0 ? (
          <div className="text-center py-12">
            <div className="loading loading-spinner loading-lg text-pink-500"></div>
            <p className="mt-4 text-pink-400">Cargando juegos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map(game => (
              <GameCard
                key={game._id}
                game={game}
                onAddToCart={() => handleAddToCart(game)}
                onPlay={handlePlay}
                isPurchased={user?.purchasedGames?.includes(game._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
