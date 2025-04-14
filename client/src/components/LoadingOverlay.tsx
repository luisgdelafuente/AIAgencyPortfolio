import React from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLoadingState } from "@/hooks/use-loading-state";

export default function LoadingOverlay() {
  const { isLoading } = useLoadingState();
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-md p-2 z-50">
      <LoadingSpinner size="md" />
    </div>
  );
}