import '../client/src/index.css';
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "@/hooks/use-language";
import { TranslationProvider } from "@/hooks/use-translations";
import React from "react";

export const metadata = {
  title: 'HAL149',
  description: 'AI-powered agency website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <TranslationProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </TranslationProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}