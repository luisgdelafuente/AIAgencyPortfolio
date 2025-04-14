import React from 'react';
import { Helmet } from "react-helmet";
import { Metadata } from '@/lib/metadata';

interface MetaTagsProps {
  metadata: Metadata;
  type?: 'website' | 'article';
  url?: string;
}

/**
 * Reusable component for rendering meta tags across the site
 */
export default function MetaTags({ 
  metadata, 
  type = 'website',
  url
}: MetaTagsProps) {
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords && <meta name="keywords" content={metadata.keywords} />}
      
      {/* Canonical URL */}
      {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
      {!metadata.canonical && url && <link rel="canonical" href={url} />}
      
      {/* Open Graph / Social Media Meta Tags */}
      {metadata.ogTitle 
        ? <meta property="og:title" content={metadata.ogTitle} />
        : <meta property="og:title" content={metadata.title} /> 
      }
      
      {metadata.ogDescription 
        ? <meta property="og:description" content={metadata.ogDescription} />
        : (metadata.description && <meta property="og:description" content={metadata.description} />)
      }
      
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={metadata.ogImage ? "summary_large_image" : "summary"} />
      {metadata.ogTitle 
        ? <meta name="twitter:title" content={metadata.ogTitle} />
        : <meta name="twitter:title" content={metadata.title} /> 
      }
      
      {metadata.ogDescription 
        ? <meta name="twitter:description" content={metadata.ogDescription} />
        : (metadata.description && <meta name="twitter:description" content={metadata.description} />)
      }
      
      {metadata.ogImage && <meta name="twitter:image" content={metadata.ogImage} />}
    </Helmet>
  );
}