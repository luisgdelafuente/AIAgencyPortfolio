import React from 'react';

interface AdminMetadataProps {
  title: string;
  description?: string;
  noIndex?: boolean;
}

/**
 * Component to set metadata for admin pages
 * Uses direct DOM manipulation to update existing meta tags
 */
export function AdminMetadata({
  title,
  description = "Admin area for HAL149 - AI solutions",
  noIndex = true
}: AdminMetadataProps) {
  
  React.useEffect(() => {
    // Set page title
    if (title) document.title = title;
    
    // Set meta description
    if (description) {
      updateMetaTag('meta', { name: 'description', content: description });
    }
    
    // Set robots directive for admin pages
    if (noIndex) {
      updateMetaTag('meta', { name: 'robots', content: 'noindex, nofollow' });
    }
    
    // Also update OG tags for consistency
    updateMetaTag('meta', { property: 'og:title', content: title });
    updateMetaTag('meta', { property: 'og:description', content: description });
    
    // Clean up any Replit metadata attributes
    cleanReplitAttributes();
    
  }, [title, description, noIndex]);
  
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