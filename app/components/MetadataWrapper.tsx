'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';

/**
 * Enhanced component that loads metadata from the API and applies it 
 * both directly to the DOM and through Next.js head for better SSR support
 */
export default function MetadataWrapper() {
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetadata() {
      try {
        // Fetch metadata for current page from API
        const pagePath = window.location.pathname.replace(/^\/+|\/+$/g, '') || 'home';
        const response = await fetch(`/api/page-contents/${pagePath}`);
        
        if (!response.ok) {
          console.error('Failed to fetch metadata for', pagePath);
          return;
        }
        
        const data = await response.json();
        if (!data || !data.content) return;
        
        // Parse content
        let content;
        try {
          content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        } catch (error) {
          console.error('Error parsing page content:', error);
          return;
        }
        
        const pageMetadata = content.metadata || {};
        
        // Apply directly to DOM for immediate effect
        if (pageMetadata.title) {
          document.title = pageMetadata.title;
        }
        
        // Apply description
        if (pageMetadata.description) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', pageMetadata.description);
          } else {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            metaDesc.setAttribute('content', pageMetadata.description);
            document.head.appendChild(metaDesc);
          }
        }
        
        // Apply other meta tags directly
        const metaTags = [
          { name: 'keywords', content: pageMetadata.keywords },
          { property: 'og:title', content: pageMetadata.ogTitle || pageMetadata.title },
          { property: 'og:description', content: pageMetadata.ogDescription || pageMetadata.description },
          { property: 'og:image', content: pageMetadata.ogImage },
          { property: 'og:url', content: pageMetadata.canonical || window.location.href },
          { property: 'og:type', content: 'website' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: pageMetadata.ogTitle || pageMetadata.title },
          { name: 'twitter:description', content: pageMetadata.ogDescription || pageMetadata.description },
          { name: 'twitter:image', content: pageMetadata.ogImage }
        ];
        
        metaTags.forEach(tag => {
          if (!tag.content) return; // Skip if no content
          
          const selector = tag.name 
            ? `meta[name="${tag.name}"]` 
            : `meta[property="${tag.property}"]`;
          
          let metaTag = document.querySelector(selector);
          
          if (metaTag) {
            metaTag.setAttribute('content', tag.content);
          } else {
            metaTag = document.createElement('meta');
            if (tag.name) metaTag.setAttribute('name', tag.name);
            if (tag.property) metaTag.setAttribute('property', tag.property);
            metaTag.setAttribute('content', tag.content);
            document.head.appendChild(metaTag);
          }
        });
        
        // Apply canonical URL
        if (pageMetadata.canonical) {
          let canonical = document.querySelector('link[rel="canonical"]');
          if (canonical) {
            canonical.setAttribute('href', pageMetadata.canonical);
          } else {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', pageMetadata.canonical);
            document.head.appendChild(canonical);
          }
        }
        
        // Store metadata for Next.js Head component
        setMetadata(pageMetadata);
        setIsLoading(false);
        console.log('Successfully loaded metadata for', pagePath);
      } catch (error) {
        console.error('Error applying metadata:', error);
        setIsLoading(false);
      }
    }
    
    loadMetadata();
  }, []);
  
  // Render Next.js Head component with the fetched metadata
  // This approach combines client-side DOM manipulation with SSR-friendly Head
  if (!metadata) return null;
  
  return (
    <Head>
      {metadata.title && <title>{metadata.title}</title>}
      {metadata.description && <meta name="description" content={metadata.description} />}
      {metadata.keywords && <meta name="keywords" content={metadata.keywords} />}
      
      {/* Open Graph */}
      {(metadata.ogTitle || metadata.title) && 
        <meta property="og:title" content={metadata.ogTitle || metadata.title} />}
      {(metadata.ogDescription || metadata.description) && 
        <meta property="og:description" content={metadata.ogDescription || metadata.description} />}
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      {(metadata.canonical || typeof window !== 'undefined' ? window.location.href : '') && 
        <meta property="og:url" content={metadata.canonical || 
          (typeof window !== 'undefined' ? window.location.href : '')} />}
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {(metadata.ogTitle || metadata.title) && 
        <meta name="twitter:title" content={metadata.ogTitle || metadata.title} />}
      {(metadata.ogDescription || metadata.description) && 
        <meta name="twitter:description" content={metadata.ogDescription || metadata.description} />}
      {metadata.ogImage && <meta name="twitter:image" content={metadata.ogImage} />}
      
      {/* Canonical */}
      {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
    </Head>
  );
}