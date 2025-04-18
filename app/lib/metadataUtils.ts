import { Metadata } from 'next';
import { fetchPageContent } from './api';

// Enhanced default metadata with branded HAL149 info
const defaultMetadata: Metadata = {
  title: 'HAL149 - AI Solutions',
  description: 'HAL149 provides advanced AI solutions for businesses of all sizes.',
};

/**
 * Get metadata from database for a specific page
 * This function is critical for SEO and directly outputs metadata for Next.js App Router
 */
export async function getPageMetadata(page: string): Promise<Metadata> {
  console.log(`[Metadata] Fetching metadata for page: ${page}`);
  
  // Fetch page content from database with no-cache policy
  const pageContent = await fetchPageContent(page);
  
  if (!pageContent || !pageContent.content) {
    console.warn(`[Metadata] No content found for ${page}, using default metadata`);
    return defaultMetadata;
  }
  
  // Parse the content
  let parsedContent;
  try {
    parsedContent = typeof pageContent.content === 'string' 
      ? JSON.parse(pageContent.content) 
      : pageContent.content;
  } catch (error) {
    console.error(`[Metadata] Error parsing ${page} content:`, error);
    return defaultMetadata;
  }
  
  // Extract metadata from content
  const metadata = parsedContent.metadata || {};
  console.log(`[Metadata] Extracted metadata for ${page}:`, JSON.stringify(metadata));
  
  // Prepare explicit metadata object with only string values
  // This follows Next.js recommendations for static metadata values
  const result: Metadata = {
    title: metadata.title || defaultMetadata.title,
    description: metadata.description || defaultMetadata.description,
    keywords: metadata.keywords || '',
    
    // Apply explicit openGraph properties
    openGraph: {
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [{ url: metadata.ogImage }] : undefined,
      url: metadata.canonical || 'https://hal149.com',
      siteName: 'HAL149',
      locale: 'en_US',
      type: 'website',
    },
    
    // Apply explicit Twitter Card properties
    twitter: {
      card: 'summary_large_image',
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
      creator: '@hal149',
    },
  };
  
  // Add canonical URL if available
  if (metadata.canonical) {
    result.alternates = { 
      canonical: metadata.canonical 
    };
  }
  
  // Ensure robots metadata is present for indexing
  result.robots = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  };
  
  console.log(`[Metadata] Final metadata for ${page}:`, JSON.stringify(result));
  return result;
}