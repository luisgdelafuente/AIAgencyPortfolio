/**
 * Early-loading metadata script for HAL149
 * This script runs before React loads and directly updates meta tags based on the current URL
 */
(function() {
  // Debugging flag
  const DEBUG = true;
  
  // Log helper
  function log(...args) {
    if (DEBUG) console.log(...args);
  }
  
  // Default metadata as fallback
  const DEFAULT_METADATA = {
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
    canonical: 'https://hal149.com',
    ogTitle: 'HAL149 | AI Agency',
    ogDescription: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
    ogType: 'website'
  };
  
  // Function to fetch JSON data with retry
  async function fetchWithRetry(url, retries = 3, delay = 300) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          log(`Fetch attempt ${i+1} failed for ${url}: ${response.status}`);
          throw new Error(`HTTP error ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) {
          log(`All ${retries} fetch attempts failed for ${url}:`, error);
          return null;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next retry
        delay *= 1.5;
      }
    }
    return null;
  }
  
  // Determine the page type and slug from the URL
  function getPageInfo() {
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
  
  // Update all meta tags with the provided metadata
  function updateAllMetaTags(metadata) {
    if (!metadata) return;
    
    log('Updating meta tags with:', metadata);
    
    // Document title
    document.title = metadata.title || DEFAULT_METADATA.title;
    
    // Function to update meta tags with a specific attribute (name or property)
    function updateMetaTag(attributeName, name, content) {
      if (!content) return;
      
      // Try to find the tag
      let tag = document.querySelector(`meta[${attributeName}="${name}"]`);
      
      // Create if it doesn't exist
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeName, name);
        document.head.appendChild(tag);
      }
      
      // Set the content
      tag.setAttribute('content', content);
    }
    
    // Update all name-based meta tags
    updateMetaTag('name', 'description', metadata.description);
    updateMetaTag('name', 'keywords', metadata.keywords);
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', metadata.ogTitle || metadata.title);
    updateMetaTag('name', 'twitter:description', metadata.ogDescription || metadata.description);
    updateMetaTag('name', 'twitter:image', metadata.ogImage);
    updateMetaTag('name', 'robots', 'index, follow');
    
    // Update all property-based meta tags (OpenGraph)
    updateMetaTag('property', 'og:title', metadata.ogTitle || metadata.title);
    updateMetaTag('property', 'og:description', metadata.ogDescription || metadata.description);
    updateMetaTag('property', 'og:image', metadata.ogImage);
    updateMetaTag('property', 'og:url', metadata.canonical);
    updateMetaTag('property', 'og:type', metadata.ogType || 'website');
    updateMetaTag('property', 'og:site_name', 'HAL149');
    
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metadata.canonical || DEFAULT_METADATA.canonical);
    
    // Update any tags with data-dynamic-meta attribute for backwards compatibility
    document.querySelectorAll('[data-dynamic-meta]').forEach(el => {
      const metaType = el.getAttribute('data-dynamic-meta');
      
      // Handle special cases
      switch (metaType) {
        case 'title':
          if (el.tagName === 'TITLE') {
            el.textContent = metadata.title || DEFAULT_METADATA.title;
          } else {
            el.setAttribute('content', metadata.title || DEFAULT_METADATA.title);
          }
          break;
        case 'canonical':
          if (el.tagName === 'LINK') {
            el.setAttribute('href', metadata.canonical || DEFAULT_METADATA.canonical);
          }
          break;
        case 'og:title':
          el.setAttribute('content', metadata.ogTitle || metadata.title || DEFAULT_METADATA.title);
          break;
        case 'og:description':
          el.setAttribute('content', metadata.ogDescription || metadata.description || DEFAULT_METADATA.description);
          break;
        case 'twitter:title':
          el.setAttribute('content', metadata.ogTitle || metadata.title || DEFAULT_METADATA.title);
          break;
        case 'twitter:description':
          el.setAttribute('content', metadata.ogDescription || metadata.description || DEFAULT_METADATA.description);
          break;
        default:
          // Standard case - just update content if the metadata has the same property
          if (metadata[metaType]) {
            if (el.tagName === 'LINK') {
              el.setAttribute('href', metadata[metaType]);
            } else {
              el.setAttribute('content', metadata[metaType]);
            }
          }
      }
    });
    
    // Remove any Replit-specific meta tags
    document.querySelectorAll('meta').forEach(tag => {
      const content = tag.getAttribute('content');
      if (
        (content && content.includes('replit')) || 
        tag.getAttribute('name')?.includes('replit') || 
        tag.getAttribute('property')?.includes('replit')
      ) {
        tag.remove();
      }
    });
  }
  
  // Extract metadata from page content
  function extractMetadataFromPageContent(pageContent) {
    if (!pageContent || !pageContent.content) {
      log('No page content or empty content');
      return null;
    }
    
    try {
      // Parse content object if it's a string
      const contentObj = typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
      
      // Extract metadata from content object
      if (contentObj.metadata) {
        log('Found metadata in page content', contentObj.metadata);
        return contentObj.metadata;
      } else {
        log('No metadata found in page content');
        return null;
      }
    } catch (error) {
      log('Error parsing page content', error);
      return null;
    }
  }
  
  // Extract metadata from a blog post or project
  function extractMetadataFromItem(item, type) {
    if (!item) {
      log('No item data');
      return null;
    }
    
    // Base URL for canonical links
    const baseUrl = 'https://hal149.com';
    
    // Build metadata object
    const metadata = {
      title: item.title ? `${item.title} | HAL149` : DEFAULT_METADATA.title,
      description: item.excerpt || item.description || DEFAULT_METADATA.description,
      keywords: item.tags || item.category || '',
      canonical: item.slug ? `${baseUrl}/${type}/${item.slug}/` : DEFAULT_METADATA.canonical,
      ogTitle: item.title ? `${item.title} | HAL149` : DEFAULT_METADATA.ogTitle,
      ogDescription: item.excerpt || item.description || DEFAULT_METADATA.ogDescription,
      ogImage: item.imageUrl || DEFAULT_METADATA.ogImage,
      ogType: type === 'blog' ? 'article' : 'website'
    };
    
    log('Extracted metadata from item:', metadata);
    return metadata;
  }
  
  // Main function to load and apply metadata
  async function loadAndApplyMetadata() {
    // Get current page info
    const { pageName, slug, type } = getPageInfo();
    log('Page info:', { pageName, slug, type });
    
    // Always fetch the page content first
    const pageContent = await fetchWithRetry(`/api/page-contents/${pageName}`);
    log('Page content fetched:', pageContent);
    
    // Extract base metadata from page content
    let metadata = extractMetadataFromPageContent(pageContent);
    log('Base metadata:', metadata);
    
    // Default canonical URL based on current path
    const pathname = window.location.pathname;
    const defaultCanonical = `https://hal149.com${pathname === '/' ? '' : pathname}`;
    
    // If this is a blog post or project page, fetch the specific item
    if (slug && type) {
      const itemData = await fetchWithRetry(`/api/${type}/${slug}`);
      log('Item data fetched:', itemData);
      
      if (itemData) {
        // Extract metadata from the item and merge with page metadata
        const itemMetadata = extractMetadataFromItem(itemData, type);
        
        metadata = {
          ...(metadata || {}),
          ...(itemMetadata || {})
        };
        
        log('Combined metadata after item data:', metadata);
      }
    }
    
    // Ensure we have canonical URLs
    if (metadata && !metadata.canonical) {
      metadata.canonical = defaultCanonical;
    }
    
    // Apply metadata to the page
    updateAllMetaTags(metadata || DEFAULT_METADATA);
  }
  
  // Load metadata immediately
  loadAndApplyMetadata();
  
  // Also load metadata after DOMContentLoaded for safety
  document.addEventListener('DOMContentLoaded', loadAndApplyMetadata);
})();