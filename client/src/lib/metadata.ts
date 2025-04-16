import { PageContent } from '@shared/schema';

// Minimal default metadata - only used when no data exists in the database
// This is intentionally minimal to ensure the database values are always used when available
export const defaultMetadata = {
  title: 'HAL149',
  description: '', // Empty to ensure Google doesn't use a hardcoded fallback
  keywords: '',
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
  
  // Handle cases where metadata might be stored in the content
  let extractedMetadata = {};
  try {
    // If content is a JSON string, try to extract metadata from it
    if (typeof item.content === 'string' && item.content.trim().startsWith('{')) {
      const contentObj = JSON.parse(item.content);
      if (contentObj.metadata) {
        extractedMetadata = contentObj.metadata;
      }
    }
  } catch (e) {
    console.error('Error parsing metadata from content:', e);
  }
  
  // Normalize image URL (handle both imageUrl and image_url)
  const imageUrl = item.imageUrl || item.image_url || '';
  
  // Extract relevant fields from item
  const baseMetadata = {
    title: item.title ? `${item.title} | HAL149` : '',
    description: item.excerpt || item.description || '',
    keywords: item.category ? `${item.category}` : '',
    // Respect manually set canonical URL if it exists, otherwise generate it
    canonical: extractedMetadata?.canonical 
      ? extractedMetadata.canonical
      : item.slug 
        ? `https://hal149.com/${item.type || 'blog'}/${item.slug}/` 
        : '',
  };
  
  // Return with social media metadata defaulting to regular metadata
  return {
    ...baseMetadata,
    // Apply any extracted metadata properties
    ...extractedMetadata,
    // Social media fields default to their corresponding metadata fields if not already set
    ogTitle: extractedMetadata?.ogTitle || baseMetadata.title,
    ogDescription: extractedMetadata?.ogDescription || baseMetadata.description,
    // For projects and blog posts with images
    ogImage: extractedMetadata?.ogImage || imageUrl
  };
}