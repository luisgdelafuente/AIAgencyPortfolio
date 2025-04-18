import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

/**
 * Dynamic head component with Helmet to properly render metadata
 */
export default function DynamicHead({
  title = 'HAL149 | AI Agency',
  description = 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
  keywords = 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  canonical = 'https://hal149.com',
  ogTitle,
  ogDescription,
  ogImage = 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
  ogType = 'website'
}: MetadataProps) {
  // Use provided OpenGraph values or fall back to standard metadata
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const [location] = useLocation();
  
  useEffect(() => {
    // Remove any Replit-specific title or meta tags that might be present
    const replitTitles = document.querySelectorAll('title');
    if (replitTitles.length > 1) {
      Array.from(replitTitles).forEach((titleEl, index) => {
        if (index > 0 && titleEl.textContent?.includes('Replit')) {
          titleEl.remove();
        }
      });
    }
    
    // Override document title directly
    document.title = title;
    
    // Try to find and remove any Replit-specific meta tags
    document.querySelectorAll('meta').forEach(meta => {
      const content = meta.getAttribute('content');
      if (
        content?.includes('replit.com') || 
        meta.getAttribute('name')?.includes('replit') ||
        meta.getAttribute('property')?.includes('replit')
      ) {
        meta.remove();
      }
    });
    
    // Set the canonical URL using DOM directly as an additional measure
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', canonical);
    } else {
      const canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonical;
      document.head.appendChild(canonicalLink);
    }
  }, [title, canonical, location]);

  return (
    <HelmetProvider>
      <Helmet prioritizeSeoTags>
        {/* Basic Metadata */}
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonical} />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={finalOgTitle} />
        <meta property="og:description" content={finalOgDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:site_name" content="HAL149" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalOgTitle} />
        <meta name="twitter:description" content={finalOgDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        
        {/* Robots and other meta */}
        <meta name="robots" content="index, follow" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Prevent Replit from adding their meta tags */}
        <meta name="app-only" content="true" />
      </Helmet>
    </HelmetProvider>
  );
}