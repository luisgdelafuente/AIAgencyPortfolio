import { Metadata } from 'next';

// Define default metadata for the entire site
export const defaultMetadata: Metadata = {
  title: {
    template: '%s | HAL149',
    default: 'HAL149 - AI Solutions',
  },
  description: 'HAL149 provides advanced AI solutions for businesses of all sizes.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hal149.com',
    siteName: 'HAL149',
    title: 'HAL149 - AI Solutions',
    description: 'HAL149 provides advanced AI solutions for businesses of all sizes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAL149 - AI Solutions',
    description: 'HAL149 provides advanced AI solutions for businesses of all sizes.',
    creator: '@hal149',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.png',
  },
  metadataBase: new URL('https://hal149.com'),
};

// Parse database content to Metadata
export function parseMetadata(content: any): Metadata {
  if (!content || !content.metadata) {
    return defaultMetadata;
  }
  
  const { metadata } = content;
  
  return {
    title: metadata.title || defaultMetadata.title,
    description: metadata.description || defaultMetadata.description,
    keywords: metadata.keywords || '',
    
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: metadata.canonical || 'https://hal149.com',
      siteName: 'HAL149',
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [
        {
          url: metadata.ogImage,
          width: 1200,
          height: 630,
          alt: metadata.title || 'HAL149',
        }
      ] : undefined,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
      creator: '@hal149',
    },
    
    // Canonical URL for SEO
    alternates: metadata.canonical ? {
      canonical: metadata.canonical,
    } : undefined,
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      }
    },
  };
}