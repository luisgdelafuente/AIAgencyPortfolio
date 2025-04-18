import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { PageContent, BlogPost, Project } from '@shared/schema';
import { extractMetadata, extractItemMetadata } from '@/lib/metadata';
import DynamicHead from './DynamicHead';

/**
 * MetadataSync - Synchronizes metadata based on current route
 * 
 * This component monitors route changes and fetches the appropriate
 * content and metadata from the API, then renders a DynamicHead
 * component with the correct metadata for SEO.
 */
export function MetadataSync() {
  const [location] = useLocation();
  const [metadata, setMetadata] = useState({
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
    canonical: 'https://hal149.com',
    ogTitle: '',
    ogDescription: '',
    ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
    ogType: 'website' as 'website' | 'article'
  });
  
  // Fetch base page content for the current route
  const pagePath = getPagePathFromLocation(location);
  
  const { data: pageContent } = useQuery<PageContent>({
    queryKey: [`/api/page-contents/${pagePath}`],
    enabled: !!pagePath,
  });
  
  // Fetch item-specific data for individual blog posts or projects
  const { slug, type } = getSlugFromLocation(location);
  
  const { data: itemData } = useQuery<BlogPost | Project>({
    queryKey: [`/api/${type}/${slug}`],
    enabled: !!slug && !!type,
  });
  
  // Update metadata when route or data changes
  useEffect(() => {
    // Skip on first render without data
    if (!location) return;
    
    console.log('Page content received:', pageContent);
    
    // Extract metadata with inheritance
    const baseMetadata = extractMetadata(pageContent);
    
    // Base canonical URL on current path
    let canonicalUrl = `https://hal149.com${location}`;
    if (location === '/') {
      canonicalUrl = 'https://hal149.com';
    }
    
    // Determine content type
    const contentType = type === 'blog' ? 'article' as const : 'website' as const;
    
    // Create metadata object
    let updatedMetadata = {
      title: baseMetadata.title || 'HAL149 | AI Agency',
      description: baseMetadata.description || '',
      keywords: baseMetadata.keywords || '',
      canonical: baseMetadata.canonical || canonicalUrl,
      ogTitle: baseMetadata.ogTitle || baseMetadata.title || '',
      ogDescription: baseMetadata.ogDescription || baseMetadata.description || '',
      ogImage: baseMetadata.ogImage || 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
      ogType: contentType
    };
    
    // For item pages (blog posts, projects), add item metadata
    if (itemData) {
      console.log('Item data received:', itemData);
      const itemMetadata = extractItemMetadata(itemData);
      updatedMetadata = {
        ...updatedMetadata,
        title: itemMetadata.title || updatedMetadata.title,
        description: itemMetadata.description || updatedMetadata.description,
        keywords: itemMetadata.keywords || updatedMetadata.keywords,
        canonical: itemMetadata.canonical || updatedMetadata.canonical,
        ogTitle: itemMetadata.ogTitle || itemMetadata.title || updatedMetadata.ogTitle,
        ogDescription: itemMetadata.ogDescription || itemMetadata.description || updatedMetadata.ogDescription,
        ogImage: itemMetadata.ogImage || updatedMetadata.ogImage,
        // Keep the ogType to make TypeScript happy
        ogType: type === 'blog' ? 'article' as const : 'website' as const
      };
    }
    
    // Log what we're doing
    console.log('Setting metadata to:', updatedMetadata);
    
    // Update state
    setMetadata(updatedMetadata);
    
  }, [location, pageContent, itemData, type]);
  
  // Helpers to parse route information
  function getPagePathFromLocation(path: string): string {
    // Strip leading slash and query params
    const cleanPath = path.replace(/^\/+/, '').split('?')[0].split('#')[0];
    
    // Special case for home page
    if (!cleanPath) return 'home';
    
    // Handle blog post routes
    if (cleanPath.startsWith('blog/') && cleanPath !== 'blog/') {
      return 'blog';
    }
    
    // Handle project routes
    if (cleanPath.startsWith('projects/') && cleanPath !== 'projects/') {
      return 'projects';
    }
    
    // For other routes, use the first part of the path
    return cleanPath.split('/')[0];
  }
  
  function getSlugFromLocation(path: string): { slug: string | null, type: string | null } {
    // Check if it's a blog post page
    if (path.match(/^\/blog\/([^\/]+)\/?$/)) {
      const match = path.match(/^\/blog\/([^\/]+)\/?$/);
      return { slug: match ? match[1] : null, type: 'blog' };
    }
    
    // Check if it's a project page
    if (path.match(/^\/projects\/([^\/]+)\/?$/)) {
      const match = path.match(/^\/projects\/([^\/]+)\/?$/);
      return { slug: match ? match[1] : null, type: 'projects' };
    }
    
    return { slug: null, type: null };
  }
  
  // Render the dynamic head with current metadata
  return (
    <DynamicHead
      title={metadata.title}
      description={metadata.description}
      keywords={metadata.keywords}
      canonical={metadata.canonical}
      ogTitle={metadata.ogTitle}
      ogDescription={metadata.ogDescription}
      ogImage={metadata.ogImage}
      ogType={metadata.ogType}
    />
  );
}