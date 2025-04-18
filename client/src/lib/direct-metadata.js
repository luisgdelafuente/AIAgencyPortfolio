/**
 * Direct metadata updater for HAL149
 */

// Get metadata directly from the database and apply it
export async function applyMetadata() {
  try {
    // Get current page name
    const pageName = getCurrentPageName();
    console.log('Current page:', pageName);
    
    // Fetch metadata for this page
    const response = await fetch(`/api/page-contents/${pageName}`);
    if (!response.ok) throw new Error(`Failed to fetch metadata: ${response.status}`);
    
    const data = await response.json();
    console.log('Page data:', data);
    
    // Extract metadata
    const metadata = extractMetadata(data);
    console.log('Extracted metadata:', metadata);
    
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
      
      // Update canonical
      updateCanonical(metadata.canonical);
    }
  } catch (error) {
    console.error('Error applying metadata:', error);
  }
}

// Helper function to get current page name from URL
function getCurrentPageName() {
  const path = window.location.pathname;
  
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/blog/') && path !== '/blog/') return 'blog';
  if (path.startsWith('/projects/') && path !== '/projects/') return 'projects';
  
  return path.replace(/^\/+/, '').split('/')[0];
}

// Extract metadata from page content
function extractMetadata(pageContent) {
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
function updateMetaTag(name, content, isProperty = false) {
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
function updateCanonical(href) {
  if (!href) return;
  
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}