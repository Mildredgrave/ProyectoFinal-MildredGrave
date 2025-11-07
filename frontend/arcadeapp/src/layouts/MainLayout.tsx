import React from 'react';
import { Header } from '../components/Header';
import { Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};