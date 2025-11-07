import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { MyGames } from './pages/MyGames';
import { useAuthStore } from './store/authStore';
import { ToastProvider } from './components/toast/ToastContext';
import { Toasts } from './components/toast/Toasts';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="cart" element={<Cart />} />
            <Route path="admin" element={<Admin />} />
            <Route path="my-games" element={<MyGames />} />
          </Route>
        </Routes>
        <Toasts />
      </Router>
    </ToastProvider>
  );
}

export default App;