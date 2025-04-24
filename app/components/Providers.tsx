'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '../hooks/use-language';
import { TranslationProvider } from '../hooks/use-translations';
import { AuthProvider } from '../context/auth-context';
// Using custom toast provider since the original one has issues
import { v4 as uuid } from 'uuid';

// Create a client
const queryClient = new QueryClient();

// Custom Toast Provider implementation since it's missing from the UI components
// Create the context outside the component
const ToastContext = React.createContext<any>(null);
ToastContext.displayName = 'ToastContext';

export function CustomToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = React.useState<any[]>([]);

  const toast = React.useCallback(
    (props: any) => {
      const id = uuid();
      const newToast = { ...props, id };

      setToasts((prevToasts) => {
        const nextToasts = prevToasts.slice(0, 4); // Keep only the latest 5 toasts max
        return [newToast, ...nextToasts];
      });

      return {
        id,
        dismiss: () => setToasts((t) => t.filter((toast) => toast.id !== id)),
        update: (props: any) =>
          setToasts((t) => t.map((toast) => (toast.id === id ? { ...toast, ...props } : toast))),
      };
    },
    [setToasts]
  );

  const dismiss = React.useCallback(
    (toastId?: string) => {
      if (toastId) {
        setToasts((t) => t.filter((toast) => toast.id !== toastId));
      } else {
        setToasts([]);
      }
    },
    [setToasts]
  );

  const contextValue = React.useMemo(
    () => ({
      toast,
      dismiss,
      toasts,
    }),
    [toast, dismiss, toasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

// Add a custom useToast hook that uses our context
export function useCustomToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomToastProvider>
        <LanguageProvider>
          <TranslationProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </TranslationProvider>
        </LanguageProvider>
      </CustomToastProvider>
    </QueryClientProvider>
  );
}