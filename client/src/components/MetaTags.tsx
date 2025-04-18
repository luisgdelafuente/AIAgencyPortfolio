import React from 'react';
import { Metadata } from '@/lib/metadata';

interface MetaTagsProps {
  metadata: Metadata;
  type?: 'website' | 'article';
  url?: string;
  pageTitle?: string; // Optional explicit page title that overrides metadata.title
}

/**
 * Enhanced Meta Tags component
 * 
 * This component updates the meta tags that exist in the index.html template
 * We've added default metadata tags to the HTML template for better SEO
 * This component updates those tags based on page-specific data
 */
export default function MetaTags({ 
  metadata, 
  type = 'website',
  url,
  pageTitle
}: MetaTagsProps) {
  // Define values once
  const finalTitle = pageTitle || metadata.title || document.title || 'HAL149';
  const metaDescription = metadata.description || '';
  const canonicalUrl = getCanonicalUrl(metadata, url);
  const ogTitle = metadata.ogTitle || finalTitle;
  const ogDescription = metadata.ogDescription || metaDescription;
  
  // Update meta tags when component mounts or props change
  React.useEffect(() => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return; // Don't modify anything if we don't have metadata
    }
    
    // Basic metadata - find the title tag with the data-dynamic-meta attribute
    if (finalTitle) {
      document.title = finalTitle;
      const titleTag = document.querySelector('title[data-dynamic-meta="title"]');
      if (titleTag) {
        titleTag.textContent = finalTitle;
      }
    }
    
    if (metaDescription) {
      updateMetaTag('meta', { name: 'description', content: metaDescription });
    }
    
    if (metadata.keywords) {
      updateMetaTag('meta', { name: 'keywords', content: metadata.keywords });
    }
    
    // Canonical URL
    updateMetaTag('link', { rel: 'canonical', href: canonicalUrl });
    
    // Open Graph tags
    updateMetaTag('meta', { property: 'og:title', content: ogTitle });
    
    if (ogDescription) {
      updateMetaTag('meta', { property: 'og:description', content: ogDescription });
    }
    
    if (metadata.ogImage) {
      updateMetaTag('meta', { property: 'og:image', content: metadata.ogImage });
    }
    
    updateMetaTag('meta', { property: 'og:type', content: type });
    
    if (url) {
      updateMetaTag('meta', { property: 'og:url', content: url });
    }
    
    // Twitter Card tags
    updateMetaTag('meta', { 
      name: 'twitter:card', 
      content: metadata.ogImage ? 'summary_large_image' : 'summary'
    });
    
    updateMetaTag('meta', { name: 'twitter:title', content: ogTitle });
    
    if (ogDescription) {
      updateMetaTag('meta', { name: 'twitter:description', content: ogDescription });
    }
    
    if (metadata.ogImage) {
      updateMetaTag('meta', { name: 'twitter:image', content: metadata.ogImage });
    }
    
    // Remove any remaining Replit metadata attributes
    cleanReplitAttributes();
    
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
  
  // Helper function to update meta tags - uses data-dynamic-meta where available
  function updateMetaTag(
    tagName: 'meta' | 'link', 
    attributes: Record<string, string>
  ) {
    let selector = '';
    let dynamicAttribute = '';
    
    // Determine the data-dynamic-meta attribute name based on the attribute
    if (attributes.name) {
      selector = `${tagName}[name="${attributes.name}"]`;
      dynamicAttribute = attributes.name;
    } else if (attributes.property) {
      selector = `${tagName}[property="${attributes.property}"]`;
      dynamicAttribute = attributes.property;
    } else if (attributes.rel) {
      selector = `${tagName}[rel="${attributes.rel}"]`;
      dynamicAttribute = attributes.rel;
    }
    
    // First try to find a tag with the data-dynamic-meta attribute
    const dynamicTag = document.querySelector(`${tagName}[data-dynamic-meta="${dynamicAttribute}"]`);
    const existingTag = dynamicTag || document.querySelector(selector);
    
    if (existingTag) {
      // Update existing tag
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'content' || key === 'href') {
          existingTag.setAttribute(key, value);
        } else {
          existingTag.setAttribute(key, value);
        }
      });
    } else {
      // Create new tag
      const newTag = document.createElement(tagName);
      Object.entries(attributes).forEach(([key, value]) => {
        newTag.setAttribute(key, value);
      });
      // Also add the data-dynamic-meta attribute for future updates
      newTag.setAttribute('data-dynamic-meta', dynamicAttribute);
      document.head.appendChild(newTag);
    }
  }
  
  // Clean up any Replit metadata attributes
  function cleanReplitAttributes() {
    const allMetaTags = document.head.querySelectorAll('meta, link');
    allMetaTags.forEach(tag => {
      if (tag.hasAttribute('data-replit-metadata')) {
        tag.removeAttribute('data-replit-metadata');
      }
      if (tag.hasAttribute('data-component-name')) {
        tag.removeAttribute('data-component-name');
      }
      if (tag.hasAttribute('data-rh')) {
        tag.removeAttribute('data-rh');
      }
    });
  }
  
  // This component doesn't render anything visible
  return null;
}