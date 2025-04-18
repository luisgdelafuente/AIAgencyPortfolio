/**
 * This script runs early to override Replit metadata
 * It's added directly to the HTML and runs before React mounts
 */
(function() {
  // Default metadata for the site (fallback)
  const defaultMetadata = {
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
    canonical: 'https://hal149.com',
    ogTitle: 'HAL149 | AI Agency',
    ogDescription: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
    ogType: 'website'
  };

  // Function to override the metadata
  function overrideMetadata() {
    // Set the document title immediately
    document.title = defaultMetadata.title;
    
    // Helper to create or update meta tags
    function setMetaTag(name, content, property = false) {
      // Try to find existing tag
      const attr = property ? 'property' : 'name';
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      // Create if doesn't exist
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      
      // Set the content
      meta.setAttribute('content', content);
    }
    
    // Set basic meta tags
    setMetaTag('description', defaultMetadata.description);
    setMetaTag('keywords', defaultMetadata.keywords);
    
    // Set OpenGraph meta tags
    setMetaTag('og:title', defaultMetadata.ogTitle, true);
    setMetaTag('og:description', defaultMetadata.ogDescription, true);
    setMetaTag('og:image', defaultMetadata.ogImage, true);
    setMetaTag('og:type', defaultMetadata.ogType, true);
    setMetaTag('og:url', defaultMetadata.canonical, true);
    
    // Set Twitter meta tags
    setMetaTag('twitter:title', defaultMetadata.ogTitle);
    setMetaTag('twitter:description', defaultMetadata.ogDescription);
    setMetaTag('twitter:image', defaultMetadata.ogImage);
    setMetaTag('twitter:card', 'summary_large_image');
    
    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', defaultMetadata.canonical);
    
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
    
    // Override any Replit titles
    document.querySelectorAll('title').forEach((el, index) => {
      if (index > 0 || el.textContent.includes('Replit')) {
        el.remove();
      }
    });
  }
  
  // Run immediately
  overrideMetadata();
  
  // Also run when DOM is loaded (for safety)
  document.addEventListener('DOMContentLoaded', overrideMetadata);
})();