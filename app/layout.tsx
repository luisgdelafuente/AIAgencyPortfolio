import './globals.css';
import React from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { Providers } from './providers';

// Define default metadata for the site
export const siteMetadata = {
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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* SEO meta tags */}
        <title>{siteMetadata.title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta name="keywords" content={siteMetadata.keywords} />
        
        {/* OpenGraph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hal149.com" />
        <meta property="og:title" content={siteMetadata.openGraph.title} />
        <meta property="og:description" content={siteMetadata.openGraph.description} />
        <meta property="og:image" content="https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp" />
        <meta property="og:site_name" content={siteMetadata.openGraph.siteName} />
        <meta property="og:locale" content={siteMetadata.openGraph.locale} />
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteMetadata.twitter.title} />
        <meta name="twitter:description" content={siteMetadata.twitter.description} />
        <meta name="twitter:image" content="https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp" />
        
        {/* Other meta tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hal149.com" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}