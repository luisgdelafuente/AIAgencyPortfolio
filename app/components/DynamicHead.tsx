'use client';

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface MetadataType {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

const defaultMetadata: MetadataType = {
  title: 'HAL149',
  description: '',
  keywords: '',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: ''
};

export default function DynamicHead({ pageName }: { pageName: string }) {
  const [metadata, setMetadata] = useState<MetadataType>(defaultMetadata);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const response = await fetch(`/api/page-contents/${pageName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata for ${pageName}`);
        }
        
        const data = await response.json();
        
        if (data && data.content) {
          const content = JSON.parse(data.content);
          
          if (content.metadata) {
            setMetadata({
              title: content.metadata.title || defaultMetadata.title,
              description: content.metadata.description || defaultMetadata.description,
              keywords: content.metadata.keywords || defaultMetadata.keywords,
              canonical: content.metadata.canonical || `https://hal149.com/${pageName === 'home' ? '' : pageName}`,
              ogTitle: content.metadata.ogTitle || content.metadata.title || defaultMetadata.title,
              ogDescription: content.metadata.ogDescription || content.metadata.description || defaultMetadata.description,
              ogImage: content.metadata.ogImage || defaultMetadata.ogImage
            });
            
            // Log the metadata for debugging
            console.log('Home page metadata:', defaultMetadata);
            console.log('Home page metadata:', metadata);
          }
        }
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMetadata();
  }, [pageName]);

  if (isLoading) {
    return null;
  }

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metadata.canonical} />
      <meta property="og:title" content={metadata.ogTitle} />
      <meta property="og:description" content={metadata.ogDescription} />
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      <meta property="og:site_name" content="HAL149" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.ogTitle} />
      <meta name="twitter:description" content={metadata.ogDescription} />
      {metadata.ogImage && <meta name="twitter:image" content={metadata.ogImage} />}
      
      {/* Other meta tags */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={metadata.canonical} />
    </Helmet>
  );
}