import React from 'react';
import { useToast } from './ToastContext';

export const Toasts: React.FC = () => {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-white ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          <div className="flex justify-between items-center">
            <div>{t.message}</div>
            <button className="ml-4 font-bold" onClick={() => remove(t.id)}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toasts;
