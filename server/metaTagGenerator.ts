/**
 * Server-side meta tag generator for SEO and social media sharing
 */
import { BlogPost, Project } from '@shared/schema';
import { supabase } from './supabase';
import { storage } from './storage';

// Types for metadata
interface Metadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  [key: string]: string;
}

// Default metadata
const defaultMetadata: Metadata = {
  title: 'HAL149',
  description: '',
  keywords: '',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'website',
  ogUrl: ''
};

/**
 * Extract metadata from content based on route
 * @param url The current URL
 * @returns Promise with metadata object
 */
export async function getMetadataForUrl(url: string): Promise<Metadata> {
  try {
    // Start with default metadata
    let metadata = { ...defaultMetadata };
    
    // Split URL to determine page type
    const urlPath = url.split('?')[0]; // Remove query parameters
    const segments = urlPath.split('/').filter(segment => segment.length > 0);
    
    // Home page
    if (segments.length === 0) {
      const homePageContent = await storage.getPageContent('home');
      if (homePageContent?.content) {
        try {
          const contentObj = JSON.parse(homePageContent.content);
          if (contentObj.metadata) {
            Object.assign(metadata, contentObj.metadata);
            metadata.canonical = `https://hal149.com/`;
            metadata.ogUrl = metadata.canonical;
          }
        } catch (e) {
          console.error('Error parsing home page content:', e);
        }
      }
      return metadata;
    }
    
    // Top-level pages: about, contact, blog, projects, legal
    if (segments.length === 1) {
      const pageName = segments[0];
      const pageContent = await storage.getPageContent(pageName);
      
      if (pageContent?.content) {
        try {
          const contentObj = JSON.parse(pageContent.content);
          if (contentObj.metadata) {
            Object.assign(metadata, contentObj.metadata);
            metadata.canonical = `https://hal149.com/${pageName}/`;
            metadata.ogUrl = metadata.canonical;
          }
        } catch (e) {
          console.error(`Error parsing ${pageName} page content:`, e);
        }
      }
      return metadata;
    }
    
    // Blog post or project detail
    if (segments.length === 2) {
      const contentType = segments[0];
      const slug = segments[1];
      
      if (contentType === 'blog') {
        const post = await storage.getBlogPostBySlug(slug);
        if (post) {
          return await getMetadataForBlogPost(post, url);
        }
      } else if (contentType === 'projects') {
        const project = await storage.getProjectBySlug(slug);
        if (project) {
          return await getMetadataForProject(project, url);
        }
      }
    }
    
    // Default metadata with canonical URL
    metadata.canonical = `https://hal149.com${urlPath.endsWith('/') ? urlPath : urlPath + '/'}`;
    metadata.ogUrl = metadata.canonical;
    
    return metadata;
  } catch (error) {
    console.error('Error getting metadata for URL:', error);
    return defaultMetadata;
  }
}

/**
 * Extract metadata for a blog post
 * @param post The blog post
 * @param url Current URL
 * @returns Metadata for the blog post
 */
async function getMetadataForBlogPost(post: BlogPost, url: string): Promise<Metadata> {
  // Start with default metadata
  const metadata: Metadata = { ...defaultMetadata };
  
  // Extract base metadata from post fields
  metadata.title = `${post.title} | HAL149`;
  metadata.description = post.excerpt || '';
  
  // Get the canonical URL
  const canonicalPath = url.split('?')[0]; // Remove query params
  metadata.canonical = `https://hal149.com${canonicalPath.endsWith('/') ? canonicalPath : canonicalPath + '/'}`;
  metadata.ogUrl = metadata.canonical;
  
  // Set Open Graph specific fields
  metadata.ogTitle = post.title;
  metadata.ogDescription = post.excerpt || '';
  metadata.ogImage = post.imageUrl || post.image_url || '';
  metadata.ogType = 'article';
  
  // Try to extract additional metadata from content if it's in JSON format
  try {
    if (typeof post.content === 'string' && post.content.trim().startsWith('{')) {
      const contentObj = JSON.parse(post.content);
      if (contentObj.metadata) {
        // Override with any custom metadata fields
        for (const [key, value] of Object.entries(contentObj.metadata)) {
          metadata[key] = String(value || '');
        }
      }
    }
  } catch (e) {
    console.error('Error parsing blog post content metadata:', e);
  }
  
  return metadata;
}

/**
 * Extract metadata for a project
 * @param project The project
 * @param url Current URL
 * @returns Metadata for the project
 */
async function getMetadataForProject(project: Project, url: string): Promise<Metadata> {
  // Start with default metadata
  const metadata: Metadata = { ...defaultMetadata };
  
  // Extract base metadata from project fields
  metadata.title = `${project.title} | HAL149`;
  metadata.description = project.description || '';
  
  // Get the canonical URL
  const canonicalPath = url.split('?')[0]; // Remove query params
  metadata.canonical = `https://hal149.com${canonicalPath.endsWith('/') ? canonicalPath : canonicalPath + '/'}`;
  metadata.ogUrl = metadata.canonical;
  
  // Set Open Graph specific fields
  metadata.ogTitle = project.title;
  metadata.ogDescription = project.description || '';
  metadata.ogImage = project.imageUrl || project.image_url || '';
  metadata.ogType = 'article';
  
  // Try to extract additional metadata from content if it's in JSON format
  try {
    if (typeof project.content === 'string' && project.content.trim().startsWith('{')) {
      const contentObj = JSON.parse(project.content);
      if (contentObj.metadata) {
        // Override with any custom metadata fields
        for (const [key, value] of Object.entries(contentObj.metadata)) {
          metadata[key] = String(value || '');
        }
      }
    }
  } catch (e) {
    console.error('Error parsing project content metadata:', e);
  }
  
  return metadata;
}

/**
 * Generate HTML meta tags for a given metadata object
 * @param metadata The metadata object
 * @returns HTML string with meta tags
 */
export function generateMetaTags(metadata: Metadata): string {
  let metaTags = '';
  
  // Title tag
  if (metadata.title) {
    metaTags += `<title>${escapeHtml(metadata.title)}</title>\n`;
  }
  
  // Basic meta tags
  if (metadata.description) {
    metaTags += `<meta name="description" content="${escapeHtml(metadata.description)}">\n`;
  }
  
  if (metadata.keywords) {
    metaTags += `<meta name="keywords" content="${escapeHtml(metadata.keywords)}">\n`;
  }
  
  // Canonical URL
  if (metadata.canonical) {
    metaTags += `<link rel="canonical" href="${escapeHtml(metadata.canonical)}">\n`;
  }
  
  // Open Graph tags
  metaTags += `<meta property="og:type" content="${escapeHtml(metadata.ogType || 'website')}">\n`;
  
  if (metadata.ogTitle || metadata.title) {
    metaTags += `<meta property="og:title" content="${escapeHtml(metadata.ogTitle || metadata.title)}">\n`;
  }
  
  if (metadata.ogDescription || metadata.description) {
    metaTags += `<meta property="og:description" content="${escapeHtml(metadata.ogDescription || metadata.description)}">\n`;
  }
  
  if (metadata.ogImage) {
    metaTags += `<meta property="og:image" content="${escapeHtml(metadata.ogImage)}">\n`;
  }
  
  if (metadata.ogUrl || metadata.canonical) {
    metaTags += `<meta property="og:url" content="${escapeHtml(metadata.ogUrl || metadata.canonical)}">\n`;
  }
  
  metaTags += `<meta property="og:site_name" content="HAL149">\n`;
  
  // Twitter Card tags
  const twitterCardType = metadata.ogImage ? 'summary_large_image' : 'summary';
  metaTags += `<meta name="twitter:card" content="${twitterCardType}">\n`;
  
  if (metadata.ogTitle || metadata.title) {
    metaTags += `<meta name="twitter:title" content="${escapeHtml(metadata.ogTitle || metadata.title)}">\n`;
  }
  
  if (metadata.ogDescription || metadata.description) {
    metaTags += `<meta name="twitter:description" content="${escapeHtml(metadata.ogDescription || metadata.description)}">\n`;
  }
  
  if (metadata.ogImage) {
    metaTags += `<meta name="twitter:image" content="${escapeHtml(metadata.ogImage)}">\n`;
  }
  
  return metaTags;
}

/**
 * Escape HTML entities in a string to prevent XSS attacks
 * @param text Input text
 * @returns Escaped text
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}