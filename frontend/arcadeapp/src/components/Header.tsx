import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar bg-purple-600 text-purple-50 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl text-purple-50 hover:text-white">
          ARCADESTORE
        </Link>
      </div>
      <div className="flex-none gap-2">
        {user ? (
          <>
            <Link to="/cart" className="btn btn-ghost text-purple-50 hover:bg-purple-500">
              🛒 Carrito
            </Link>
            <Link to="/my-games" className="btn btn-ghost text-purple-50 hover:bg-purple-500">
              Mis Juegos
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-ghost text-purple-50 hover:bg-purple-500">
                Administrador
              </Link>
            )}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-purple-300 flex items-center justify-center text-purple-900 font-bold">
                  <span className="text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-purple-100 rounded-box w-52 text-purple-800"
              >
                <li>
                  <span>Hola, {user.name}</span>
                </li>
                <li><span className="text-sm text-purple-600">{user.email}</span></li>
                <li><div className="divider my-1"></div></li>
                <li><button onClick={handleLogout} className="hover:bg-purple-200">Cerrar Sesión</button></li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost text-purple-50 hover:bg-purple-500">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn bg-purple-300 hover:bg-purple-400 text-purple-900 font-semibold">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
