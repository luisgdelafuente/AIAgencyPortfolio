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
  [key: string]: string; // Allow for additional metadata properties
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
        // Ensure all values are strings to avoid Symbol conversion issues
        const safeMetadata = Object.entries(contentObj.metadata).reduce((acc, [key, value]) => {
          acc[key] = (value !== null && value !== undefined) ? String(value) : '';
          return acc;
        }, {} as Record<string, string>);
        
        metadata = {
          ...metadata,
          ...safeMetadata
        };
      }
    }
    
    // Layer 2: If explicit parent metadata is provided, override with it
    if (parentMetadata) {
      // Convert all metadata values to strings
      const safeParentMetadata = Object.entries(parentMetadata).reduce((acc, [key, value]) => {
        acc[key] = (value !== null && value !== undefined) ? String(value) : '';
        return acc;
      }, {} as Record<string, string>);
      
      metadata = {
        ...metadata,
        ...safeParentMetadata
      };
    }
    
    // Layer 3: If item-specific metadata exists, it takes highest precedence
    if (itemMetadata) {
      // Convert all metadata values to strings
      const safeItemMetadata = Object.entries(itemMetadata).reduce((acc, [key, value]) => {
        acc[key] = (value !== null && value !== undefined) ? String(value) : '';
        return acc;
      }, {} as Record<string, string>);
      
      metadata = {
        ...metadata,
        ...safeItemMetadata
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
  let extractedMetadata: Partial<Metadata> & Record<string, string> = {};
  try {
    // If content is a JSON string, try to extract metadata from it
    if (typeof item.content === 'string' && item.content.trim().startsWith('{')) {
      const contentObj = JSON.parse(item.content);
      if (contentObj.metadata) {
        // Ensure all metadata values are strings
        const rawMetadata = contentObj.metadata;
        Object.keys(rawMetadata).forEach(key => {
          if (rawMetadata[key] !== null && rawMetadata[key] !== undefined) {
            extractedMetadata[key] = String(rawMetadata[key]);
          }
        });
      }
    }
  } catch (e) {
    console.error('Error parsing metadata from content:', e);
  }
  
  // Normalize image URL (handle both imageUrl and image_url)
  const imageUrl = String(item.imageUrl || item.image_url || '');
  
  // Extract relevant fields from item
  const baseMetadata = {
    title: item.title ? `${String(item.title)} | HAL149` : '',
    description: String(item.excerpt || item.description || ''),
    keywords: item.category ? String(item.category) : '',
    // Respect manually set canonical URL if it exists, otherwise generate it
    canonical: extractedMetadata.canonical 
      ? (String(extractedMetadata.canonical).endsWith('/') 
          ? String(extractedMetadata.canonical) 
          : String(extractedMetadata.canonical) + '/')
      : item.slug 
        ? `https://hal149.com/${item.type || 'blog'}/${String(item.slug)}/` 
        : '',
  };
  
  // Create final metadata with social media fields defaulting to regular fields
  const finalMetadata: Partial<Metadata> = {
    ...baseMetadata,
    ogTitle: String(extractedMetadata.ogTitle || baseMetadata.title || ''),
    ogDescription: String(extractedMetadata.ogDescription || baseMetadata.description || ''),
    ogImage: String(extractedMetadata.ogImage || imageUrl || '')
  };
  
  // Copy any other extracted metadata properties after converting to strings
  for (const key in extractedMetadata) {
    if (key !== 'ogTitle' && key !== 'ogDescription' && key !== 'ogImage') {
      finalMetadata[key] = String(extractedMetadata[key] || '');
    }
  }
  
  return finalMetadata;
}