'use client';

import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}