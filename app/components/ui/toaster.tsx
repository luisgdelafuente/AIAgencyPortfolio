"use client";

import { useToast } from "@/components/ui/use-toast";
import { Toast } from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          onClose={() => dismiss(toast.id)}
          className="w-full sm:w-96"
        />
      ))}
    </div>
  );
}