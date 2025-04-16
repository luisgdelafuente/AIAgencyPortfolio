import React from 'react';
import { Helmet } from "react-helmet";
import { Metadata } from '@/lib/metadata';

interface MetaTagsProps {
  metadata: Partial<Metadata>;
  type?: string;
  url?: string;
  pageTitle?: string; // Optional explicit page title that overrides metadata.title
}

/**
 * Reusable component for rendering meta tags across the site
 * Ensures all metadata comes from the database with no hardcoded values
 */
export default function MetaTags({ 
  metadata, 
  type = 'website',
  url,
  pageTitle
}: MetaTagsProps) {
  // Make sure we're working with string values only
  const safeMetadata = {
    title: String(metadata.title || ''),
    description: String(metadata.description || ''),
    keywords: String(metadata.keywords || ''),
    canonical: String(metadata.canonical || ''),
    ogTitle: String(metadata.ogTitle || ''),
    ogDescription: String(metadata.ogDescription || ''),
    ogImage: String(metadata.ogImage || '')
  };
  
  // Final title to use - prioritize specific page title if provided
  const finalTitle = pageTitle ? String(pageTitle) : safeMetadata.title;
  
  // To avoid blank meta description which Google doesn't like
  const metaDescription = safeMetadata.description;
  
  // Ensure we have a valid og:image URL
  const ogImage = safeMetadata.ogImage;
  
  // Ensure we have a valid canonical URL with proper formatting and trailing slash
  let canonicalUrl = '';
  if (safeMetadata.canonical && safeMetadata.canonical.startsWith('http')) {
    // Use canonical URL as is if it's already a full URL, adding trailing slash if needed
    canonicalUrl = safeMetadata.canonical.endsWith('/') 
      ? safeMetadata.canonical
      : safeMetadata.canonical + '/';
  } else if (safeMetadata.canonical) {
    // Add domain to canonical URL if it's a relative path, ensuring trailing slash
    const path = safeMetadata.canonical.endsWith('/')
      ? safeMetadata.canonical
      : safeMetadata.canonical + '/';
    canonicalUrl = `https://hal149.com${path.startsWith('/') ? '' : '/'}${path}`;
  } else if (url && String(url).startsWith('http')) {
    // Use provided URL if it's already a full URL, adding trailing slash if needed
    const fullUrl = String(url);
    canonicalUrl = fullUrl.endsWith('/') ? fullUrl : fullUrl + '/';
  } else if (url) {
    // Add domain to provided URL, ensuring trailing slash
    const safeUrl = String(url);
    const path = safeUrl.endsWith('/') ? safeUrl : safeUrl + '/';
    canonicalUrl = `https://hal149.com${path.startsWith('/') ? '' : '/'}${path}`;
  } else {
    // Fallback to current path, ensuring trailing slash
    const path = window.location.pathname;
    canonicalUrl = `https://hal149.com${path.endsWith('/') ? path : path + '/'}`;
  }
  
  try {
    return (
      <Helmet>
        {/* Basic meta tags */}
        <title>{finalTitle}</title>
        <meta name="description" content={metaDescription} />
        {safeMetadata.keywords && <meta name="keywords" content={safeMetadata.keywords} />}
        
        {/* Canonical URL - always use fully formed URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={safeMetadata.ogTitle || finalTitle} />
        <meta property="og:description" content={safeMetadata.ogDescription || metaDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="HAL149" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={safeMetadata.ogTitle || finalTitle} />
        <meta name="twitter:description" content={safeMetadata.ogDescription || metaDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Helmet>
    );
  } catch (error) {
    console.error('Error rendering meta tags:', error);
    return null;
  }
}