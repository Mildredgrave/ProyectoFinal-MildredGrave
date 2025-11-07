import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useGamesStore } from '../store/gamesStore';
import type { Game, Score } from '../types';
import { scoresAPI } from '../services/api';
import userGamesAPI from '../services/userGames';
import JuegoApp from '../modules/Games/balloon-pop/App';
import PuzzleApp from '../modules/Games/puzzle/App';

export const MyGames: React.FC = () => {
  const { user } = useAuthStore();
  const { games, fetchGames } = useGamesStore();
  const [purchasedGames, setPurchasedGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (user && games.length > 0) {
      const userGames = games.filter(game => user.purchasedGames?.includes(game._id));
      setPurchasedGames(userGames);
    }
  }, [user, games]);

  const handlePlayGame = async (game: Game) => {
    setSelectedGame(game);
    await fetchTopScores(game._id);
  };

  const handleRemoveGame = async (game: Game) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego de tu biblioteca?')) {
      try {
        console.log('Intentando eliminar juego:', game._id);
        const response = await userGamesAPI.removeGame(game._id);
        console.log('Respuesta del servidor:', response.data);
        
        // Actualiza el estado del usuario con los datos actualizados
        if (response.data.user) {
          useAuthStore.setState({ user: response.data.user });
          // Actualiza la lista de juegos comprados
          if (user && games.length > 0) {
            const userGames = games.filter(g => 
              response.data.user.purchasedGames?.includes(g._id)
            );
            setPurchasedGames(userGames);
          }
        }
      } catch (error: any) {
        console.error('Error al eliminar el juego:', error);
        alert(error.response?.data?.message || 'Error al eliminar el juego de tu biblioteca');
      }
    }
  };

  const fetchTopScores = async (gameId: string) => {
    try {
      const response = await scoresAPI.getTopScores(gameId);
      setScores(response.data);
    } catch (error) {
      console.error('Error al cargar scores:', error);
    }
  };

  const submitScore = async () => {
    if (!selectedGame) return;
    try {
      await scoresAPI.submitScore(selectedGame._id, currentScore);
      await fetchTopScores(selectedGame._id);
      alert(`¡Puntuación de ${currentScore} registrada!`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Debes iniciar sesión para ver tus juegos</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Juegos</h1>

      {purchasedGames.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Aún no tienes juegos</h2>
          <p className="text-gray-600 mb-6">¡Compra algunos juegos en la tienda para empezar a jugar!</p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
            Explorar Tienda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Tu Biblioteca ({purchasedGames.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchasedGames.map(game => (
                <div key={game._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <figure className="px-4 pt-4">
                    <img src={game.iconUrl} alt={game.name} className="rounded-xl h-32 w-full object-cover" />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-lg">{game.name}</h3>
                    <p className="text-gray-600 text-sm">{game.category}</p>
                    <div className="card-actions justify-end gap-2">
                      <button className="btn btn-primary btn-sm" onClick={() => handlePlayGame(game)}>
                        Jugar
                      </button>
                      {game.isFree && (
                        <button 
                          className="btn btn-error btn-sm" 
                          onClick={() => handleRemoveGame(game)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Detalles</h2>
            <div className="card bg-base-200 shadow-xl mb-6">
              <div className="card-body">
                <h3 className="card-title">Selecciona un juego para ver más</h3>
                <p className="text-gray-600">Haz clic en Jugar en cualquiera de tus juegos para abrirlo en pantalla completa.</p>
              </div>
            </div>
          </div>
        </div>
      )}

     
      {selectedGame && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
          <div className="p-2 flex justify-end">
            <button className="btn btn-circle btn-ghost text-white" onClick={() => setSelectedGame(null)} aria-label="Cerrar juego">✕</button>
          </div>

          <div className="flex-1 w-full h-full flex items-center ">
            <div className="w-full h-full">
              {selectedGame.name === 'balloon-pop' && <JuegoApp />}
              {selectedGame.name === 'Puzzle' && <PuzzleApp />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};