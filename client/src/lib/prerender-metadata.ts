/**
 * Utility to help with SEO by setting metadata in the prerender
 * This allows search engines to see the proper metadata in the HTML source
 */

import type { Metadata } from './metadata';

/**
 * Updates the HTML <head> metadata in the source, not just the DOM
 * This helps with SEO as search engines will see these tags in the source HTML
 */
export function updateSourceMetadata(metadata: Partial<Metadata>, type: 'website' | 'article' = 'website') {
  // Title tag
  if (metadata.title) {
    updateMetaSourceTag('title', metadata.title);
  }
  
  // Basic meta tags
  if (metadata.description) {
    updateMetaSourceTag('description', metadata.description);
  }
  
  if (metadata.keywords) {
    updateMetaSourceTag('keywords', metadata.keywords);
  }
  
  // OpenGraph tags
  if (metadata.ogTitle || metadata.title) {
    updateMetaSourceTag('og:title', metadata.ogTitle || metadata.title || '');
  }
  
  if (metadata.ogDescription || metadata.description) {
    updateMetaSourceTag('og:description', metadata.ogDescription || metadata.description || '');
  }
  
  if (metadata.ogImage) {
    updateMetaSourceTag('og:image', metadata.ogImage);
  }
  
  updateMetaSourceTag('og:type', type);
  
  if (metadata.canonical) {
    updateMetaSourceTag('canonical', metadata.canonical);
  }
  
  // Twitter cards
  updateMetaSourceTag('twitter:card', metadata.ogImage ? 'summary_large_image' : 'summary');
  
  if (metadata.ogTitle || metadata.title) {
    updateMetaSourceTag('twitter:title', metadata.ogTitle || metadata.title || '');
  }
  
  if (metadata.ogDescription || metadata.description) {
    updateMetaSourceTag('twitter:description', metadata.ogDescription || metadata.description || '');
  }
  
  if (metadata.ogImage) {
    updateMetaSourceTag('twitter:image', metadata.ogImage);
  }
}

/**
 * Updates a specific metadata tag with the provided value
 */
function updateMetaSourceTag(name: string, content: string) {
  // Special case for title tag
  if (name === 'title') {
    document.title = content;
    
    // Find title element with data-dynamic-meta attribute
    const titleElement = document.querySelector('title[data-dynamic-meta="title"]');
    if (titleElement) {
      titleElement.textContent = content;
    }
    return;
  }
  
  // Special case for canonical URL
  if (name === 'canonical') {
    const canonicalElement = document.querySelector('link[data-dynamic-meta="canonical"]');
    if (canonicalElement) {
      canonicalElement.setAttribute('href', content);
    }
    return;
  }
  
  // For other tags
  let selector = '';
  
  // Handle Open Graph tags differently
  if (name.startsWith('og:')) {
    selector = `meta[data-dynamic-meta="og:${name.substring(3)}"]`;
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('content', content);
    }
  } else if (name.startsWith('twitter:')) {
    // Handle Twitter card tags
    selector = `meta[data-dynamic-meta="${name}"]`;
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('content', content);
    }
  } else {
    // Regular meta tags
    selector = `meta[data-dynamic-meta="${name}"]`;
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('content', content);
    }
  }
}