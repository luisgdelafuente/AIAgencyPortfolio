"use client";

import * as React from "react";
import { v4 as uuid } from "uuid";
import { ToastActionElement, type ToastProps } from "./toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000 * 60 * 60 * 24; // 1 day

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Toast = Omit<ToasterToast, "id">;

interface ToastContextType {
  toast: (props: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  dismiss: (toastId?: string) => void;
  toasts: ToasterToast[];
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const toast = React.useCallback(
    (props: Toast) => {
      const id = uuid();
      const newToast = { ...props, id };

      setToasts((prevToasts) => {
        // Check if we already have the maximum number of toasts
        const nextToasts = prevToasts.slice(0, TOAST_LIMIT - 1);

        return [newToast, ...nextToasts];
      });

      // Return handlers for updating and dismissing the toast
      return {
        id,
        dismiss: () => dismiss(id),
        update: (props: ToasterToast) =>
          setToasts((prevToasts) =>
            prevToasts.map((t) => (t.id === id ? { ...t, ...props } : t))
          ),
      };
    },
    [setToasts]
  );

  const dismiss = React.useCallback(
    (toastId?: string) => {
      if (toastId) {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toastId));
      } else {
        setToasts([]);
      }
    },
    [setToasts]
  );

  // Remove toasts after a delay (for cleanup)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setToasts([]);
    }, TOAST_REMOVE_DELAY);

    return () => clearTimeout(timer);
  }, []);

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

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export { ToastProvider, type ToastProps, type ToasterToast, type Toast };