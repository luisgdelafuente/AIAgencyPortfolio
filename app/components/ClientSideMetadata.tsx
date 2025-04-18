'use client';

import { useEffect } from 'react';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

/**
 * Client component that applies metadata directly to the DOM
 * This is a fallback approach for development mode
 */
export default function ClientSideMetadata({ metadata }: { metadata: MetadataProps }) {
  useEffect(() => {
    // Implement direct DOM manipulation for metadata
    if (metadata) {
      // Set title
      if (metadata.title) {
        document.title = metadata.title;
      }
      
      // Set meta description
      if (metadata.description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', metadata.description);
        } else {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          metaDesc.setAttribute('content', metadata.description);
          document.head.appendChild(metaDesc);
        }
      }
      
      // Set other meta tags
      const metaTags = [
        { name: 'keywords', content: metadata.keywords },
        { property: 'og:title', content: metadata.ogTitle || metadata.title },
        { property: 'og:description', content: metadata.ogDescription || metadata.description },
        { property: 'og:image', content: metadata.ogImage },
        { property: 'og:url', content: metadata.canonical },
        { name: 'twitter:title', content: metadata.ogTitle || metadata.title },
        { name: 'twitter:description', content: metadata.ogDescription || metadata.description },
        { name: 'twitter:image', content: metadata.ogImage }
      ];
      
      metaTags.forEach(tag => {
        if (!tag.content) return; // Skip if no content
        
        const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
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
      
      // Set canonical
      if (metadata.canonical) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', metadata.canonical);
        } else {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute('href', metadata.canonical);
          document.head.appendChild(canonical);
        }
      }
    }
  }, [metadata]);
  
  return null; // This component doesn't render anything visible
}