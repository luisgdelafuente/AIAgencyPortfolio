/**
 * Direct metadata updater for HAL149
 */

// Get metadata directly from the database and apply it
export async function applyMetadata(): Promise<void> {
  try {
    // Get current page info
    const { pageName, slug, type } = getPageInfo();
    console.log('Page info:', { pageName, slug, type });
    
    // Fetch metadata for this page
    const response = await fetch(`/api/page-contents/${pageName}`);
    if (!response.ok) throw new Error(`Failed to fetch metadata: ${response.status}`);
    
    const data = await response.json();
    console.log('Page data:', data);
    
    // Extract metadata
    let metadata = extractMetadata(data);
    console.log('Extracted metadata:', metadata);
    
    // If this is a blog post or project detail page, fetch item data and enhance metadata
    if (slug && type) {
      console.log(`Fetching individual ${type} with slug ${slug}`);
      try {
        const itemResponse = await fetch(`/api/${type}/${slug}`);
        if (itemResponse.ok) {
          const itemData = await itemResponse.json();
          console.log('Item data:', itemData);
          
          // Get current path for canonical URL
          const path = window.location.pathname;
          
          // Create item-specific metadata
          const itemMetadata: Metadata = {
            title: `${itemData.title} | HAL149`,
            description: itemData.excerpt || itemData.description || (metadata?.description || ''),
            keywords: itemData.tags || itemData.category || (metadata?.keywords || ''),
            canonical: `https://hal149.com${path}`,
            ogTitle: `${itemData.title} | HAL149`,
            ogDescription: itemData.excerpt || itemData.description || (metadata?.description || ''),
            ogImage: itemData.imageUrl || (metadata?.ogImage || '')
          };
          
          // Merge with existing metadata, giving priority to item-specific data
          metadata = {
            ...(metadata || {}),
            ...itemMetadata
          };
          
          console.log('Enhanced metadata with item data:', metadata);
        }
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
      }
    }
    
    if (metadata) {
      // Apply metadata to document
      document.title = metadata.title || 'HAL149';
      
      // Update meta tags
      updateMetaTag('description', metadata.description);
      updateMetaTag('keywords', metadata.keywords);
      
      // Update OpenGraph tags
      updateMetaTag('og:title', metadata.ogTitle || metadata.title, true);
      updateMetaTag('og:description', metadata.ogDescription || metadata.description, true);
      updateMetaTag('og:image', metadata.ogImage, true);
      updateMetaTag('og:url', metadata.canonical, true);
      updateMetaTag('og:type', type === 'blog' ? 'article' : 'website', true);
      
      // Update Twitter tags
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', metadata.ogTitle || metadata.title);
      updateMetaTag('twitter:description', metadata.ogDescription || metadata.description);
      updateMetaTag('twitter:image', metadata.ogImage);
      
      // Update canonical
      updateCanonical(metadata.canonical);
    }
  } catch (error) {
    console.error('Error applying metadata:', error);
  }
}

// Function to get page info (name, slug, type) from URL
interface PageInfo {
  pageName: string;
  slug: string | null;
  type: string | null;
}

function getPageInfo(): PageInfo {
  const path = window.location.pathname;
  
  // Special case: home page
  if (path === '/' || path === '') {
    return { 
      pageName: 'home',
      slug: null,
      type: null
    };
  }
  
  // Check for blog post
  const blogPostMatch = path.match(/^\/blog\/([^/]+)\/?$/);
  if (blogPostMatch) {
    return {
      pageName: 'blog',
      slug: blogPostMatch[1],
      type: 'blog'
    };
  }
  
  // Check for project
  const projectMatch = path.match(/^\/projects\/([^/]+)\/?$/);
  if (projectMatch) {
    return {
      pageName: 'projects',
      slug: projectMatch[1],
      type: 'projects'
    };
  }
  
  // All other pages - take the first segment
  const pageName = path.replace(/^\/+/, '').split('/')[0];
  return {
    pageName,
    slug: null,
    type: null
  };
}

export interface Metadata {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  // For handling blog posts
  content?: string;
  excerpt?: string;
  slug?: string;
  // For handling projects
  imageUrl?: string;
  category?: string;
}

// Extract metadata from page content
function extractMetadata(pageContent: any): Metadata | null {
  if (!pageContent || !pageContent.content) return null;
  
  try {
    // Parse the content if it's a string
    const content = typeof pageContent.content === 'string' 
      ? JSON.parse(pageContent.content)
      : pageContent.content;
    
    return content.metadata || null;
  } catch (error) {
    console.error('Error parsing content:', error);
    return null;
  }
}

// Helper to update meta tags
function updateMetaTag(name: string, content?: string, isProperty = false): void {
  if (!content) return;
  
  const attr = isProperty ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attr}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

// Helper to update canonical link
function updateCanonical(href?: string): void {
  if (!href) return;
  
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}