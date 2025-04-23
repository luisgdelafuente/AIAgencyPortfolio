'use client';

import React, { ReactNode } from 'react';
import { LanguageProvider } from '../hooks/use-language';
import { TranslationProvider } from '../hooks/use-translations';
import { AuthProvider } from '../context/auth-context';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}