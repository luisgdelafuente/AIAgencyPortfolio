'use client';

import { useEffect, useState } from 'react';

/**
 * Simple component that loads metadata from the API and applies it directly to the DOM
 * Keeps admin panel control without requiring any extra scripts or maintenance
 */
export default function MetadataWrapper() {
  const [isMetadataSet, setIsMetadataSet] = useState(false);

  useEffect(() => {
    async function loadAndApplyMetadata() {
      try {
        // Don't set metadata more than once per page load
        if (isMetadataSet) return;
        
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
        
        const metadata = content.metadata || {};
        
        // Apply metadata to DOM
        if (metadata.title) {
          document.title = metadata.title;
        }
        
        // Apply description
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
        
        // Apply other meta tags
        const metaTags = [
          { name: 'keywords', content: metadata.keywords },
          { property: 'og:title', content: metadata.ogTitle || metadata.title },
          { property: 'og:description', content: metadata.ogDescription || metadata.description },
          { property: 'og:image', content: metadata.ogImage },
          { property: 'og:url', content: metadata.canonical || window.location.href },
          { property: 'og:type', content: 'website' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: metadata.ogTitle || metadata.title },
          { name: 'twitter:description', content: metadata.ogDescription || metadata.description },
          { name: 'twitter:image', content: metadata.ogImage }
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
        
        // Mark metadata as set
        setIsMetadataSet(true);
        console.log('Successfully applied metadata for', pagePath);
      } catch (error) {
        console.error('Error applying metadata:', error);
      }
    }
    
    loadAndApplyMetadata();
  }, [isMetadataSet]);
  
  // This component doesn't render anything visible
  return null;
}