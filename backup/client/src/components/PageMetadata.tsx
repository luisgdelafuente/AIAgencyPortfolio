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
 * Component to manage page metadata using direct DOM manipulation
 * Dynamically updates the document head based on provided metadata
 * Avoids React Helmet to prevent Replit metadata attributes
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
      updateOrCreateTag('meta', { name: 'description', content: description });
    }
    
    if (keywords) {
      updateOrCreateTag('meta', { name: 'keywords', content: keywords });
    }
    
    // Open Graph metadata
    if (ogTitle) {
      updateOrCreateTag('meta', { property: 'og:title', content: ogTitle });
    }
    
    if (ogDescription) {
      updateOrCreateTag('meta', { property: 'og:description', content: ogDescription });
    }
    
    if (ogImage) {
      updateOrCreateTag('meta', { property: 'og:image', content: ogImage });
    }
    
    if (ogUrl) {
      updateOrCreateTag('meta', { property: 'og:url', content: ogUrl });
    }
    
    updateOrCreateTag('meta', { property: 'og:type', content: 'website' });
    
    // Twitter Card metadata
    updateOrCreateTag('meta', { name: 'twitter:card', content: twitterCard });
    
    if (twitterTitle) {
      updateOrCreateTag('meta', { name: 'twitter:title', content: twitterTitle });
    }
    
    if (twitterDescription) {
      updateOrCreateTag('meta', { name: 'twitter:description', content: twitterDescription });
    }
    
    if (twitterImage) {
      updateOrCreateTag('meta', { name: 'twitter:image', content: twitterImage });
    }
    
    // Canonical URL
    if (canonicalUrl) {
      updateOrCreateTag('link', { rel: 'canonical', href: canonicalUrl });
    }
    
    // Remove any Replit metadata attributes
    cleanReplitMetadata();
    
  }, [
    title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl,
    twitterCard, twitterTitle, twitterDescription, twitterImage, canonicalUrl
  ]);
  
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