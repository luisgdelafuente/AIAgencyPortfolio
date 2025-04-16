/**
 * This script is loaded early in the page to ensure meta tags are set
 * even before JavaScript executes or for crawlers that don't run JS.
 */
(function() {
  // Detect if we're on a blog post
  const path = window.location.pathname;
  const pathParts = path.split('/').filter(Boolean);
  
  if (pathParts.length === 2) {
    const type = pathParts[0];
    const slug = pathParts[1];
    
    if (type === 'blog' || type === 'projects') {
      // This is a blog post or project detail page
      // Make a synchronous (blocking) request to get metadata
      const metaEndpoint = `/api/${type === 'blog' ? 'blog' : 'projects'}/${slug}`;
      
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', metaEndpoint, false); // Make synchronous request
        xhr.send();
        
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setMetaTags(data, type);
        }
      } catch (error) {
        console.error('Error fetching metadata for crawler:', error);
      }
    }
  }
  
  function setMetaTags(data, contentType) {
    if (!data) return;
    
    // Basic metadata
    const title = `${data.title} | HAL149`;
    const description = data.excerpt || data.description || '';
    const imageUrl = data.imageUrl || data.image_url || '';
    const canonicalUrl = `https://hal149.com/${contentType}/${data.slug}/`;
    
    // Set title
    document.title = title;
    
    // Helper to create or update meta tags
    function setMetaTag(name, content, property = false) {
      if (!content) return;
      
      // Look for existing tag
      let meta = property 
        ? document.querySelector(`meta[property="${name}"]`)
        : document.querySelector(`meta[name="${name}"]`);
      
      if (!meta) {
        // Create new meta tag if it doesn't exist
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      // Set content
      meta.setAttribute('content', content);
    }
    
    // Set link tags
    function setLinkTag(rel, href) {
      if (!href) return;
      
      // Look for existing tag
      let link = document.querySelector(`link[rel="${rel}"]`);
      
      if (!link) {
        // Create new link tag if it doesn't exist
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      // Set href
      link.setAttribute('href', href);
    }
    
    // Basic meta
    setMetaTag('description', description);
    setLinkTag('canonical', canonicalUrl);
    
    // Open Graph
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:type', contentType === 'blog' ? 'article' : 'website', true);
    setMetaTag('og:site_name', 'HAL149', true);
    if (imageUrl) {
      setMetaTag('og:image', imageUrl, true);
    }
    
    // Twitter
    setMetaTag('twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    if (imageUrl) {
      setMetaTag('twitter:image', imageUrl);
    }
    
    // Try to extract additional custom metadata from content
    try {
      if (typeof data.content === 'string' && data.content.trim().startsWith('{')) {
        const contentObj = JSON.parse(data.content);
        if (contentObj.metadata) {
          // Set custom metadata fields
          Object.entries(contentObj.metadata).forEach(([key, value]) => {
            if (key.startsWith('og:')) {
              setMetaTag(key, String(value), true);
            } else if (key.startsWith('twitter:')) {
              setMetaTag(key, String(value));
            }
          });
        }
      }
    } catch (e) {
      console.error('Error parsing custom metadata:', e);
    }
  }
})();