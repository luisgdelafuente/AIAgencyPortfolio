'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui';
import { useLanguage, Language } from '@/hooks/use-language';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          <span>{language === 'en' ? 'English' : 'Español'}</span>
          <Globe className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          <span className={language === 'en' ? 'font-medium' : ''}>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
          <span className={language === 'es' ? 'font-medium' : ''}>Español</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}