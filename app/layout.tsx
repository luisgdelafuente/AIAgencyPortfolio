import './globals.css';
import React from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { HelmetProvider } from 'react-helmet-async';
import DynamicHead from './components/DynamicHead';

// Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex flex-col min-h-screen">
        <HelmetProvider>
          <DynamicHead pageName="home" />
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </HelmetProvider>
      </body>
    </html>
  );
}