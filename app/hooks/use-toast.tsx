'use client';

import { useState } from 'react';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...props, id };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Automatically remove toast after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, props.duration || 5000);
    
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Simple implementation of a toast component
  // In a real app, this would be replaced with a more sophisticated component
  const ToastContainer = () => {
    if (toasts.length === 0) return null;
    
    return (
      <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded shadow-lg ${
              toast.variant === 'destructive' ? 'bg-red-500 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex justify-between">
              <h3 className="font-medium">{toast.title}</h3>
              <button onClick={() => dismissToast(toast.id)}>×</button>
            </div>
            {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
          </div>
        ))}
      </div>
    );
  };

  return { toast, ToastContainer };
}