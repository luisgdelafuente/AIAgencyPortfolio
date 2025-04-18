import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { PageContent, BlogPost, Project } from '@shared/schema';
import { extractMetadata, extractItemMetadata } from '@/lib/metadata';
import { updateSourceMetadata } from '@/lib/prerender-metadata';

/**
 * MetadataSync - Updates metadata in the HTML source based on current route
 * 
 * This component monitors route changes and updates metadata in the HTML
 * source for search engines to properly index the content.
 */
export function MetadataSync() {
  const [location] = useLocation();
  
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
  React.useEffect(() => {
    // Skip on first render without data
    if (!location) return;
    
    // Extract metadata with inheritance
    let metadata = extractMetadata(pageContent);
    
    // For item pages (blog posts, projects), add item metadata
    if (itemData) {
      const itemMetadata = extractItemMetadata(itemData);
      metadata = {
        ...metadata,
        ...itemMetadata
      };
    }
    
    // Determine content type
    const contentType = type === 'blog' ? 'article' : 'website';
    
    // Update metadata in the source HTML
    updateSourceMetadata(metadata, contentType as 'website' | 'article');
    
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
  
  // This component doesn't render anything visible
  return null;
}