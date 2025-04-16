import React, { useEffect, useState, memo } from 'react';
import { Helmet } from "react-helmet";
import { Metadata } from '@/lib/metadata';

interface MetaTagsProps {
  metadata: Partial<Metadata>;
  type?: string;
  url?: string;
  pageTitle?: string; // Optional explicit page title that overrides metadata.title
  pagePath?: string; // For identifying the current page type more easily
}

// Preloaded meta tag configurations for static pages
interface OgTagConfig {
  title: string;
  description: string;
  type: string;
  image: string;
  url: string;
}

interface OgTagConfigs {
  [key: string]: OgTagConfig;
}

/**
 * Reusable component for rendering meta tags across the site
 * Ensures all metadata comes from the database with no hardcoded values
 */
function MetaTags({ 
  metadata, 
  type = 'website',
  url,
  pageTitle,
  pagePath
}: MetaTagsProps) {
  const [staticTags, setStaticTags] = useState<OgTagConfigs | null>(null);
  
  // Load static tag configurations on first render
  useEffect(() => {
    fetch('/og-tags.json')
      .then(response => response.json())
      .then(data => {
        setStaticTags(data);
      })
      .catch(error => {
        console.error('Failed to load static OG tags:', error);
      });
  }, []);
  
  // Make sure we're working with string values only
  const safeMetadata = {
    title: String(metadata.title || ''),
    description: String(metadata.description || ''),
    keywords: String(metadata.keywords || ''),
    canonical: String(metadata.canonical || ''),
    ogTitle: String(metadata.ogTitle || ''),
    ogDescription: String(metadata.ogDescription || ''),
    ogImage: String(metadata.ogImage || ''),
    ogSiteName: String(metadata.ogSiteName || ''),
    ogLogo: String(metadata.ogLogo || '')
  };
  
  // Determine page type from path for static pregenerated tags
  const determinePageType = () => {
    if (!pagePath) {
      // Use window location as fallback
      const path = window.location.pathname;
      
      if (path === '/' || path === '') return 'home';
      if (path === '/about' || path === '/about/') return 'about';
      if (path === '/contact' || path === '/contact/') return 'contact';
      if (path === '/legal' || path === '/legal/') return 'legal';
      if (path === '/blog' || path === '/blog/') return 'blog';
      if (path === '/projects' || path === '/projects/') return 'projects';
      if (path.startsWith('/blog/') && path.length > 6) return 'blogPost';
      if (path.startsWith('/projects/') && path.length > 10) return 'project';
      
      return 'default';
    }
    
    // Use provided pagePath
    if (pagePath === '/' || pagePath === '') return 'home';
    if (pagePath === '/about' || pagePath === '/about/') return 'about';
    if (pagePath === '/contact' || pagePath === '/contact/') return 'contact';
    if (pagePath === '/legal' || pagePath === '/legal/') return 'legal';
    if (pagePath === '/blog' || pagePath === '/blog/') return 'blog';
    if (pagePath === '/projects' || pagePath === '/projects/') return 'projects';
    if (pagePath.startsWith('/blog/') && pagePath.length > 6) return 'blogPost';
    if (pagePath.startsWith('/projects/') && pagePath.length > 10) return 'project';
    
    return 'default';
  };
  
  // Get static pregenerated tags for current page if available
  const pageType = determinePageType();
  const staticConfig = staticTags && staticTags[pageType] ? staticTags[pageType] : null;
  
  // Final title to use - prioritize specific page title if provided, then metadata, then static config
  const finalTitle = pageTitle 
    ? String(pageTitle) 
    : safeMetadata.title
      ? safeMetadata.title
      : staticConfig
        ? staticConfig.title
        : '';
  
  // To avoid blank meta description which Google doesn't like
  const metaDescription = safeMetadata.description || (staticConfig ? staticConfig.description : '');
  
  // Ensure we have a valid og:image URL
  const ogImage = safeMetadata.ogImage || (staticConfig ? staticConfig.image : '');
  
  // Determine content type
  const contentType = type || (staticConfig ? staticConfig.type : 'website');
  
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
    canonicalUrl = `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  } else if (url && String(url).startsWith('http')) {
    // Use provided URL if it's already a full URL, adding trailing slash if needed
    const fullUrl = String(url);
    canonicalUrl = fullUrl.endsWith('/') ? fullUrl : fullUrl + '/';
  } else if (url) {
    // Add domain to provided URL, ensuring trailing slash
    const safeUrl = String(url);
    const path = safeUrl.endsWith('/') ? safeUrl : safeUrl + '/';
    canonicalUrl = `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  } else if (staticConfig && staticConfig.url) {
    // Use static config URL if available
    canonicalUrl = staticConfig.url;
  } else {
    // Fallback to current path, ensuring trailing slash
    const path = window.location.pathname;
    canonicalUrl = `${window.location.origin}${path.endsWith('/') ? path : path + '/'}`;
  }
  
  // Update actual meta tags in the document head as early as possible
  useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        // Set title
        if (document.title !== finalTitle) {
          document.title = finalTitle;
        }
        
        // Update meta tags directly in the document head for SEO crawlers
        updateMetaTag('description', metaDescription);
        updateMetaTag('keywords', safeMetadata.keywords);
        
        // Update Open Graph tags
        updateMetaTag('og:title', safeMetadata.ogTitle || finalTitle, true);
        updateMetaTag('og:description', safeMetadata.ogDescription || metaDescription, true);
        updateMetaTag('og:image', ogImage, true);
        updateMetaTag('og:type', contentType, true);
        updateMetaTag('og:url', canonicalUrl, true);
        
        // Update Twitter Card tags
        updateMetaTag('twitter:card', ogImage ? 'summary_large_image' : 'summary', true);
        updateMetaTag('twitter:title', safeMetadata.ogTitle || finalTitle, true);
        updateMetaTag('twitter:description', safeMetadata.ogDescription || metaDescription, true);
        updateMetaTag('twitter:image', ogImage, true);
        
        // Update canonical link tag
        let canonicalLinkElement = document.querySelector('link[rel="canonical"]');
        if (canonicalLinkElement) {
          canonicalLinkElement.setAttribute('href', canonicalUrl);
        } else {
          canonicalLinkElement = document.createElement('link');
          canonicalLinkElement.setAttribute('rel', 'canonical');
          canonicalLinkElement.setAttribute('href', canonicalUrl);
          document.head.appendChild(canonicalLinkElement);
        }
        
        // Meta tags updated successfully
      } catch (error) {
        console.error('Error updating meta tags in document:', error);
      }
    }
  }, [finalTitle, metaDescription, ogImage, canonicalUrl, contentType, pageType, staticConfig]);
  
  // Helper function to update meta tags in the document head
  const updateMetaTag = (name: string, content: string, isProperty: boolean = false) => {
    if (!content) return;
    
    // Find the existing meta tag
    const attr = isProperty ? 'property' : 'name';
    let metaElement = document.querySelector(`meta[${attr}="${name}"]`);
    
    // Update or create the meta tag
    if (metaElement) {
      metaElement.setAttribute('content', content);
    } else {
      metaElement = document.createElement('meta');
      metaElement.setAttribute(attr, name);
      metaElement.setAttribute('content', content);
      document.head.appendChild(metaElement);
    }
  };
  
  try {
    // Also use React Helmet for React-managed meta tags
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
        <meta property="og:type" content={contentType} />
        <meta property="og:url" content={canonicalUrl} />
        {safeMetadata.ogSiteName && <meta property="og:site_name" content={safeMetadata.ogSiteName} />}
        {safeMetadata.ogLogo && <meta property="og:logo" content={safeMetadata.ogLogo} />}
        
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

// Export memoized version to prevent unnecessary re-renders
export default memo(MetaTags);