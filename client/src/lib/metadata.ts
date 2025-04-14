import { PageContent } from '@shared/schema';

// Default metadata fallback values
export const defaultMetadata = {
  title: 'HAL149 - Next-Generation AI Solutions',
  description: 'Industry-specific AI applications to transform data into insights, automate workflows, and stay ahead of the competition.',
  keywords: 'AI, machine learning, data insights, automation',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: ''
};

// Types for metadata
export interface Metadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// Content object with metadata
export interface ContentWithMetadata {
  metadata?: Partial<Metadata>;
  [key: string]: any;
}

/**
 * Extracts metadata from page content with fallbacks
 * @param pageContent The page content object from the API
 * @param parentMetadata Optional parent metadata to inherit from
 * @param itemMetadata Optional item-specific metadata fields
 * @returns Metadata object with merged values
 */
export function extractMetadata(
  pageContent?: PageContent | null, 
  parentMetadata?: Partial<Metadata> | null,
  itemMetadata?: Partial<Metadata> | null
): Metadata {
  // Start with default fallback values
  let metadata = { ...defaultMetadata };
  
  // Try to parse the page content and extract metadata
  try {
    // Layer 1: If parent page content exists, use it as base
    if (pageContent?.content) {
      const contentObj = typeof pageContent.content === 'string' 
        ? JSON.parse(pageContent.content) 
        : pageContent.content;
      
      if (contentObj.metadata) {
        metadata = {
          ...metadata,
          ...contentObj.metadata
        };
      }
    }
    
    // Layer 2: If explicit parent metadata is provided, override with it
    if (parentMetadata) {
      metadata = {
        ...metadata,
        ...parentMetadata
      };
    }
    
    // Layer 3: If item-specific metadata exists, it takes highest precedence
    if (itemMetadata) {
      metadata = {
        ...metadata,
        ...itemMetadata
      };
    }
  } catch (e) {
    console.error('Error parsing page content metadata:', e);
  }
  
  return metadata;
}

/**
 * Extract metadata fields from an individual content item
 * @param item Content item (blog post, project, etc.)
 * @returns Partial metadata object with available fields
 */
export function extractItemMetadata(item: any): Partial<Metadata> {
  if (!item) return {};
  
  // Extract relevant fields from item
  return {
    title: item.title ? `${item.title} | HAL149` : '',
    description: item.excerpt || item.description || '',
    // For blog posts
    ...(item.content && { 
      ogDescription: item.excerpt || '', 
    }),
    // For projects
    ...(item.imageUrl && { 
      ogImage: item.imageUrl 
    }),
  };
}