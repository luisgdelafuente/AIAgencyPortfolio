import { Metadata } from 'next';
import { fetchPageContent } from './api';

// Default minimal metadata as fallback
const defaultMetadata: Metadata = {
  title: 'HAL149',
  description: '',
};

/**
 * Get metadata from database for a specific page
 */
export async function getPageMetadata(page: string): Promise<Metadata> {
  // Fetch page content from database
  const pageContent = await fetchPageContent(page);
  
  if (!pageContent || !pageContent.content) {
    return defaultMetadata;
  }
  
  // Parse the content
  let parsedContent;
  try {
    parsedContent = typeof pageContent.content === 'string' 
      ? JSON.parse(pageContent.content) 
      : pageContent.content;
  } catch (error) {
    console.error(`Error parsing ${page} content:`, error);
    return defaultMetadata;
  }
  
  // Extract metadata from content
  const metadata = parsedContent.metadata || {};
  
  // Format for Next.js Metadata API
  return {
    title: metadata.title || defaultMetadata.title,
    description: metadata.description || defaultMetadata.description,
    keywords: metadata.keywords || '',
    openGraph: {
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
      url: metadata.canonical || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
    },
    // Include canonical URL if available
    ...(metadata.canonical && { 
      alternates: { 
        canonical: metadata.canonical 
      } 
    }),
  };
}