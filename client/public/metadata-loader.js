/**
 * Early-loading metadata script for HAL149
 * This script runs before React loads and fetches the correct
 * metadata for the current page from the API
 */
(function() {
  // Get the current page path from the URL
  function getCurrentPage() {
    const path = window.location.pathname;
    
    // Special case for home page
    if (path === '/' || path === '') return 'home';
    
    // Handle blog post routes
    if (path.startsWith('/blog/') && path !== '/blog/') {
      return 'blog';
    }
    
    // Handle project routes
    if (path.startsWith('/projects/') && path !== '/projects/') {
      return 'projects';
    }
    
    // For other routes, use the first part of the path
    return path.replace(/^\/+/, '').split('/')[0];
  }
  
  // Extract slug from URL if it's a blog post or project
  function getSlugInfo() {
    const path = window.location.pathname;
    
    // Check if it's a blog post page
    if (path.match(/^\/blog\/([^/]+)\/?$/)) {
      const match = path.match(/^\/blog\/([^/]+)\/?$/);
      return { slug: match ? match[1] : null, type: 'blog' };
    }
    
    // Check if it's a project page
    if (path.match(/^\/projects\/([^/]+)\/?$/)) {
      const match = path.match(/^\/projects\/([^/]+)\/?$/);
      return { slug: match ? match[1] : null, type: 'projects' };
    }
    
    return { slug: null, type: null };
  }
  
  // Function to fetch JSON data
  async function fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  }
  
  // Update meta tags based on data
  function updateMetaTags(metadata) {
    if (!metadata) return;
    
    // Update title
    if (metadata.title) {
      document.title = metadata.title;
      
      // Also update any elements with data-dynamic-meta="title"
      const titleElements = document.querySelectorAll('[data-dynamic-meta="title"]');
      titleElements.forEach(el => {
        if (el.tagName === 'TITLE') {
          el.textContent = metadata.title;
        } else {
          el.setAttribute('content', metadata.title);
        }
      });
    }
    
    // Helper to update meta tags
    function updateMetaTag(name, content) {
      if (!content) return;
      
      // Regular meta tags
      const elements = document.querySelectorAll(`[data-dynamic-meta="${name}"]`);
      elements.forEach(el => {
        if (el.tagName === 'LINK') {
          el.setAttribute('href', content);
        } else {
          el.setAttribute('content', content);
        }
      });
    }
    
    // Update other meta tags
    updateMetaTag('description', metadata.description);
    updateMetaTag('keywords', metadata.keywords);
    updateMetaTag('canonical', metadata.canonical);
    updateMetaTag('og:title', metadata.ogTitle || metadata.title);
    updateMetaTag('og:description', metadata.ogDescription || metadata.description);
    updateMetaTag('og:image', metadata.ogImage);
    updateMetaTag('og:url', metadata.canonical);
    updateMetaTag('twitter:title', metadata.ogTitle || metadata.title);
    updateMetaTag('twitter:description', metadata.ogDescription || metadata.description);
    updateMetaTag('twitter:image', metadata.ogImage);
  }
  
  // Parse content to extract metadata
  function extractMetadata(pageContent) {
    if (!pageContent || !pageContent.content) return null;
    
    try {
      const contentObj = typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
      
      return contentObj.metadata || null;
    } catch (error) {
      console.error('Error parsing content:', error);
      return null;
    }
  }
  
  // Extract metadata from an item (blog post or project)
  function extractItemMetadata(item) {
    if (!item) return null;
    
    return {
      title: item.title ? `${item.title} | HAL149` : '',
      description: item.excerpt || item.description || '',
      keywords: item.tags || item.category || '',
      canonical: item.slug ? `https://hal149.com/${item.type || 'blog'}/${item.slug}/` : '',
      ogTitle: item.title ? `${item.title} | HAL149` : '',
      ogDescription: item.excerpt || item.description || '',
      ogImage: item.imageUrl || ''
    };
  }
  
  // Main function to load metadata
  async function loadMetadata() {
    // Get the current page
    const currentPage = getCurrentPage();
    console.log('Current page:', currentPage);
    
    // Fetch page content
    const pageContent = await fetchJSON(`/api/page-contents/${currentPage}`);
    console.log('Page content:', pageContent);
    
    // Extract metadata from page content
    let metadata = extractMetadata(pageContent);
    console.log('Initial metadata:', metadata);
    
    // Check for slug-based content (blog post or project)
    const { slug, type } = getSlugInfo();
    if (slug && type) {
      const itemData = await fetchJSON(`/api/${type}/${slug}`);
      console.log('Item data:', itemData);
      
      if (itemData) {
        const itemMetadata = extractItemMetadata(itemData);
        console.log('Item metadata:', itemMetadata);
        
        // Merge metadata, giving item metadata priority
        metadata = {
          ...metadata,
          ...itemMetadata
        };
      }
    }
    
    console.log('Final metadata:', metadata);
    
    // Update meta tags
    if (metadata) {
      updateMetaTags(metadata);
    }
  }
  
  // Load metadata immediately
  loadMetadata();
})();