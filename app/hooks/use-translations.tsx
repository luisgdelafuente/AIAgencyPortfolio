'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { enTranslations } from '../locales/en';
import { esTranslations } from '../locales/es';
import { useLanguage, Language } from './use-language';

// Translation maps
const translations = {
  en: enTranslations,
  es: esTranslations
};

type TranslationType = typeof enTranslations;

interface TranslationContextType {
  t: TranslationType;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  
  // Get translations for the current language
  const t = translations[language];
  
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use translations
export function useTranslations() {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  
  return context.t;
}