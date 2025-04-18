import React from 'react';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
}

/**
 * Unified Page Metadata Component
 * 
 * This component works with base meta tags defined in index.html
 * and updates them with page-specific values
 */
export function PageMetadata({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
}: MetadataProps) {
  
  // Update meta tags when component mounts or props change
  React.useEffect(() => {
    // Basic metadata
    if (title) document.title = title;
    
    if (description) {
      updateMetaTag('meta', { name: 'description', content: description });
    }
    
    if (keywords) {
      updateMetaTag('meta', { name: 'keywords', content: keywords });
    }
    
    // Open Graph metadata
    if (ogTitle || title) {
      updateMetaTag('meta', { property: 'og:title', content: ogTitle || title || '' });
    }
    
    if (ogDescription || description) {
      updateMetaTag('meta', { property: 'og:description', content: ogDescription || description || '' });
    }
    
    if (ogImage) {
      updateMetaTag('meta', { property: 'og:image', content: ogImage });
    }
    
    if (ogUrl) {
      updateMetaTag('meta', { property: 'og:url', content: ogUrl });
    }
    
    updateMetaTag('meta', { property: 'og:type', content: 'website' });
    
    // Twitter Card metadata
    updateMetaTag('meta', { name: 'twitter:card', content: twitterCard });
    
    if (twitterTitle || ogTitle || title) {
      updateMetaTag('meta', { 
        name: 'twitter:title', 
        content: twitterTitle || ogTitle || title || '' 
      });
    }
    
    if (twitterDescription || ogDescription || description) {
      updateMetaTag('meta', { 
        name: 'twitter:description', 
        content: twitterDescription || ogDescription || description || '' 
      });
    }
    
    if (twitterImage || ogImage) {
      updateMetaTag('meta', { 
        name: 'twitter:image', 
        content: twitterImage || ogImage || '' 
      });
    }
    
    // Canonical URL
    if (canonicalUrl) {
      updateMetaTag('link', { rel: 'canonical', href: canonicalUrl });
    }
    
    // Remove any Replit metadata attributes
    cleanReplitAttributes();
    
  }, [
    title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl,
    twitterCard, twitterTitle, twitterDescription, twitterImage, canonicalUrl
  ]);
  
  // Helper function to update meta tags
  function updateMetaTag(
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