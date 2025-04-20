"use client";

import * as React from "react";
import { useContext } from "react";
import { ToastActionElement, type ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000 * 60 * 60 * 24; // 1 day

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Toast = Omit<ToasterToast, "id">;

type ToastContext = {
  toast: (props: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  dismiss: (toastId?: string) => void;
  toasts: ToasterToast[];
};

const ToastContext = React.createContext<ToastContext | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  
  if (context === null) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}

export { type ToastProps, type ToasterToast, type Toast };