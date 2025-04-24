import React from 'react';
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
 * Uses direct DOM manipulation instead of React Helmet to avoid Replit metadata attributes
 */
export default function MetaTags({ 
  metadata, 
  type = 'website',
  url,
  pageTitle
}: MetaTagsProps) {
  console.log('MetaTags rendering with:', { metadata, type, url, pageTitle });
  
  // Define values once
  const finalTitle = pageTitle || metadata.title || '';
  const metaDescription = metadata.description || '';
  const canonicalUrl = getCanonicalUrl(metadata, url);
  const ogTitle = metadata.ogTitle || finalTitle;
  const ogDescription = metadata.ogDescription || metaDescription;
  
  // Update meta tags when component mounts or props change
  React.useEffect(() => {
    // Basic metadata
    document.title = finalTitle;
    updateOrCreateTag('meta', { name: 'description', content: metaDescription });
    
    if (metadata.keywords) {
      updateOrCreateTag('meta', { name: 'keywords', content: metadata.keywords });
    }
    
    // Canonical URL
    updateOrCreateTag('link', { rel: 'canonical', href: canonicalUrl });
    
    // Open Graph tags
    updateOrCreateTag('meta', { property: 'og:title', content: ogTitle });
    if (ogDescription) {
      updateOrCreateTag('meta', { property: 'og:description', content: ogDescription });
    }
    if (metadata.ogImage) {
      updateOrCreateTag('meta', { property: 'og:image', content: metadata.ogImage });
    }
    updateOrCreateTag('meta', { property: 'og:type', content: type });
    if (url) {
      updateOrCreateTag('meta', { property: 'og:url', content: url });
    }
    
    // Twitter Card tags
    updateOrCreateTag('meta', { 
      name: 'twitter:card', 
      content: metadata.ogImage ? 'summary_large_image' : 'summary'
    });
    updateOrCreateTag('meta', { name: 'twitter:title', content: ogTitle });
    if (ogDescription) {
      updateOrCreateTag('meta', { name: 'twitter:description', content: ogDescription });
    }
    if (metadata.ogImage) {
      updateOrCreateTag('meta', { name: 'twitter:image', content: metadata.ogImage });
    }
    
    // Remove any remaining Replit metadata attributes
    cleanReplitMetadata();
    
  }, [finalTitle, metaDescription, canonicalUrl, ogTitle, ogDescription, metadata, type, url]);
  
  // Helper function to get canonical URL
  function getCanonicalUrl(metadata: Metadata, url?: string): string {
    if (metadata.canonical && metadata.canonical.startsWith('http')) {
      return metadata.canonical;
    } else if (metadata.canonical && !metadata.canonical.startsWith('http')) {
      return `https://hal149.com${metadata.canonical.startsWith('/') ? '' : '/'}${metadata.canonical}`;
    } else if (url) {
      return url;
    } else {
      return `https://hal149.com${window.location.pathname}`;
    }
  }
  
  // Helper function to update or create meta/link tags
  function updateOrCreateTag(
    tagName: 'meta' | 'link', 
    attributes: Record<string, string>
  ) {
    let selector = tagName;
    
    // Build selector based on attributes
    if (attributes.name) {
      selector += `[name="${attributes.name}"]`;
    } else if (attributes.property) {
      selector += `[property="${attributes.property}"]`;
    } else if (attributes.rel) {
      selector += `[rel="${attributes.rel}"]`;
    }
    
    const existingTag = document.head.querySelector(selector);
    
    if (existingTag) {
      // Update existing tag
      Object.entries(attributes).forEach(([key, value]) => {
        existingTag.setAttribute(key, value);
      });
    } else {
      // Create new tag
      const newTag = document.createElement(tagName);
      Object.entries(attributes).forEach(([key, value]) => {
        newTag.setAttribute(key, value);
      });
      document.head.appendChild(newTag);
    }
  }
  
  // Clean up any Replit metadata attributes
  function cleanReplitMetadata() {
    const replitTags = document.head.querySelectorAll('[data-replit-metadata]');
    replitTags.forEach(tag => {
      tag.removeAttribute('data-replit-metadata');
      tag.removeAttribute('data-component-name');
      tag.removeAttribute('data-rh');
    });
  }
  
  // This component doesn't render anything visible
  return null;
}