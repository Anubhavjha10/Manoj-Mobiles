import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Toast = () => {
  const { toasts } = useStore();

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast-msg">
          <CheckCircle size={18} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
