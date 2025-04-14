import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };
  
  return (
    <div 
      className={cn(
        "inline-block animate-spin rounded-full border-current border-t-transparent text-primary/70",
        sizeClasses[size],
        className
      )}
    />
  );
}