import './globals.css';
import React from 'react';
import { Metadata } from 'next';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Define site-wide default metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://hal149.com'),
  title: 'HAL149 | AI Agency',
  description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'HAL149',
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    images: [
      {
        url: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
        width: 480,
        height: 480,
        alt: 'HAL149 Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    images: ['https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}