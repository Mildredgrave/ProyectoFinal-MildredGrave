import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' };

type ToastContextValue = {
  toasts: Toast[];
  push: (message: string, type?: Toast['type']) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    const toast: Toast = { id, message, type };
    setToasts((t) => [...t, toast]);
    // auto-remove after 4s
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 4000);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter(x => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastContext;
