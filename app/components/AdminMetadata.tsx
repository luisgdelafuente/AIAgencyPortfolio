'use client';

import React from 'react';

interface AdminMetadataProps {
  title: string;
  description?: string;
  noIndex?: boolean;
}

/**
 * Component to set metadata for admin pages
 * Uses direct DOM manipulation instead of React Helmet
 */
export function AdminMetadata({
  title,
  description = "Admin area for HAL149 - AI solutions",
  noIndex = true
}: AdminMetadataProps) {
  
  React.useEffect(() => {
    // Set page title
    document.title = title;
    
    // Set meta description
    updateOrCreateTag('meta', { name: 'description', content: description });
    
    // Set robots directive
    if (noIndex) {
      updateOrCreateTag('meta', { name: 'robots', content: 'noindex, nofollow' });
    }
    
    // Clean up any Replit metadata attributes
    cleanReplitMetadata();
    
  }, [title, description, noIndex]);
  
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