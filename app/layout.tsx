import './globals.css';
import { Metadata } from 'next';
import React from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Define default metadata for the site
export const metadata: Metadata = {
  title: 'HAL149 | AI Agency',
  description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hal149.com',
    siteName: 'HAL149',
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
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