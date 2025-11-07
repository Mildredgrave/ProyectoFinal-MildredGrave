import React, { useState, useEffect } from 'react';
import { useGamesStore } from '../store/gamesStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { games, fetchGames, addGame, deleteGame } = useGamesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isFree: false,
    icon: ''
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchGames();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGame(formData);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        isFree: false,
        icon: ''
      });
      setShowForm(false);
      alert('Juego creado exitosamente!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este juego?')) {
      try {
        await deleteGame(gameId);
        alert('Juego eliminado exitosamente!');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-error">Acceso denegado</h2>
        <p className="text-gray-600">No tienes permisos de administrador</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? ' Cancelar' : ' Agregar Juego'}
        </button>
      </div>

      {showForm && (
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Agregar Nuevo Juego</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre del Juego</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Categoría</span>
                  </label>
                  <input
                    type="text" className="input input-bordered" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Precio</span>
                  </label>
                  <input
                    type="number" step="0.01" className="input input-bordered" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} required 
                    disabled={formData.isFree}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL del Icono</span>
                  </label>
                  <input type="url" className="input input-bordered" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} required
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Descripción</span>
                  </label>
                  <textarea className="textarea textarea-bordered h-24" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required/>
                </div>
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="label-text">¿Es Gratuito?</span>
                    <input
                      type="checkbox" className="toggle toggle-primary" checked={formData.isFree} onChange={(e) => setFormData({...formData, isFree: e.target.checked, price: e.target.checked ? 0 : formData.price})}/>
                  </label>
                </div>
              </div>
              <div className="form-control mt-4">
                <button type="submit" className="btn btn-primary"> Crear Juego </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <div key={game._id} className="card bg-base-100 shadow-xl">
            <figure className="px-4 pt-4">
              <img src={game.icon} alt={game.name} className="rounded-xl h-32 w-full object-cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{game.name}</h2>
              <p className="text-gray-600 line-clamp-2 text-sm">{game.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`badge ${game.isFree ? 'badge-success' : 'badge-primary'}`}> 
                  {game.isFree ? 'Gratis' : `$${game.price}`} </span>
                <span className="badge badge-outline">{game.category}</span>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-error btn-sm" onClick={() => handleDelete(game._id)} > Eliminar  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};