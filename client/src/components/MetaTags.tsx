import React from 'react';
import { Helmet } from "react-helmet";
import { Metadata } from '@/lib/metadata';

interface MetaTagsProps {
  metadata: Metadata;
  type?: 'website' | 'article';
  url?: string;
  pageTitle?: string; // Optional explicit page title that overrides metadata.title
}

/**
 * Reusable component for rendering meta tags across the site
 * Ensures all metadata comes from the database with no hardcoded values
 */
export default function MetaTags({ 
  metadata, 
  type = 'website',
  url,
  pageTitle
}: MetaTagsProps) {
  // Final title to use - prioritize specific page title if provided
  const finalTitle = pageTitle || metadata.title || '';
  
  // To avoid blank meta description which Google doesn't like
  const metaDescription = metadata.description || '';
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={metaDescription} />
      {metadata.keywords && <meta name="keywords" content={metadata.keywords} />}
      
      {/* Canonical URL - always prefer the complete URL from database, then fallback to constructed URL */}
      {metadata.canonical && metadata.canonical.startsWith('http') 
        ? <link rel="canonical" href={metadata.canonical} /> 
        : metadata.canonical && !metadata.canonical.startsWith('http')
          ? <link rel="canonical" href={`https://hal149.com${metadata.canonical.startsWith('/') ? '' : '/'}${metadata.canonical}`} />
          : url
            ? <link rel="canonical" href={url} />
            : <link rel="canonical" href={`https://hal149.com${window.location.pathname}`} />
      }
      
      {/* Open Graph / Social Media Meta Tags */}
      {metadata.ogTitle 
        ? <meta property="og:title" content={metadata.ogTitle} />
        : <meta property="og:title" content={finalTitle} /> 
      }
      
      {metadata.ogDescription 
        ? <meta property="og:description" content={metadata.ogDescription} />
        : (metaDescription && <meta property="og:description" content={metaDescription} />)
      }
      
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={metadata.ogImage ? "summary_large_image" : "summary"} />
      {metadata.ogTitle 
        ? <meta name="twitter:title" content={metadata.ogTitle} />
        : <meta name="twitter:title" content={finalTitle} /> 
      }
      
      {metadata.ogDescription 
        ? <meta name="twitter:description" content={metadata.ogDescription} />
        : (metaDescription && <meta name="twitter:description" content={metaDescription} />)
      }
      
      {metadata.ogImage && <meta name="twitter:image" content={metadata.ogImage} />}
    </Helmet>
  );
}