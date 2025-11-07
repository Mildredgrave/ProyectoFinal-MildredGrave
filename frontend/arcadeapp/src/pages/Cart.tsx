import React, { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/toast/ToastContext';

export const Cart: React.FC = () => {
  const { items, fetchCart, removeFromCart, clearCart, checkout, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { push } = useToast();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleCheckout = async () => {
    try {
      await checkout();
      push('¡Compra realizada exitosamente! Los juegos han sido agregados a tu biblioteca.', 'success');
      navigate('/my-games');
    } catch (error: any) {
      push(error.message || 'Error en el checkout', 'error');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Debes iniciar sesión para ver el carrito</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🛒 Mi Carrito</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">¡Descubre juegos increíbles en nuestra tienda!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Explorar Juegos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map(item => (
              <div key={item.game._id} className="card bg-base-100 shadow-xl mb-4">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={(item.game as any).iconUrl || (item.game as any).icon}
                        alt={item.game.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{item.game.name}</h3>
                        <p className="text-gray-600">{item.game.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {item.game.price > 0 ? (
                        <span className="text-xl font-bold">${item.game.price}</span>
                      ) : (
                        <span className="text-xl font-bold">Gratis</span>
                      )}
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => removeFromCart(item.game._id)}
                      >
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-xl sticky top-4">
              <div className="card-body">
                <h3 className="card-title">Resumen de Compra</h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.game._id} className="flex justify-between">
                      <span>{item.game.name}</span>
                      <span>{item.game.price > 0 ? `$${item.game.price}` : 'Gratis'}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{getTotal() > 0 ? `$${getTotal().toFixed(2)}` : 'Gratis'}</span>
                  </div>
                </div>
                <div className="card-actions mt-4">
                  {getTotal() > 0 && (
                    <button 
                      className="btn btn-primary w-full"
                      onClick={handleCheckout}
                    >
                      💳 Proceder al Pago
                    </button>
                  )}
                  <button 
                    className="btn btn-outline w-full"
                    onClick={clearCart}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};