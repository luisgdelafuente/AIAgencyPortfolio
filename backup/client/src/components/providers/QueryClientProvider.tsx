'use client';

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../ui/toaster";
import { AuthProvider } from "../../hooks/use-auth";
import { LanguageProvider } from "../../hooks/use-language";
import { TranslationProvider } from "../../hooks/use-translations";
import { ReactNode, useState } from "react";

export default function QueryClientProviderWithToaster({ 
  children 
}: { 
  children: ReactNode 
}) {
  // Create a client instance that persists during the component's lifecycle
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <TanstackQueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TranslationProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </TranslationProvider>
      </LanguageProvider>
    </TanstackQueryClientProvider>
  );
}