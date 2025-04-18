'use client';

import React, { ReactNode } from 'react';
import { LanguageProvider } from '../hooks/use-language';
import { TranslationProvider } from '../hooks/use-translations';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </LanguageProvider>
  );
}