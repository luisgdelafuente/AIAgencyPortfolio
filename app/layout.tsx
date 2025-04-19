import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { ReactNode } from 'react';

// We'll import the proper provider components once the migration is more complete

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HAL149',
  description: 'AI-powered agency website',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* For now, we're directly rendering children while we complete the migration */}
        {children}
      </body>
    </html>
  );
}