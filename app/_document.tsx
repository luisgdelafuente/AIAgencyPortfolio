import { Html, Head, Main, NextScript } from 'next/document';
import { defaultMetadata } from './_fetchMetadata';

/**
 * This is a special Next.js file that enhances the HTML and body tags.
 * We use this file to add metadata to every page directly in the HTML source.
 * 
 * This approach ensures metadata is visible to search engines and social media
 * platforms regardless of JavaScript execution.
 */
export default function Document() {
  // We need to directly inject the script here to make metadata dynamic
  // This script will run on the client-side and update metadata based on the current page
  const injectMetadataScript = `
    (function() {
      // Function to fetch metadata from API
      async function fetchMetadata() {
        try {
          // Get current path
          const path = window.location.pathname.replace(/^\\/*|\\/*$/g, '') || 'home';
          
          // Handle blog posts and projects specially
          let apiPath = path;
          let isSpecificContent = false;
          let specificSlug = null;
          
          // Parse path for special content types
          const pathParts = path.split('/');
          if (pathParts.length >= 2) {
            if (pathParts[0] === 'blog') {
              apiPath = 'blog';
              specificSlug = pathParts[1];
              isSpecificContent = true;
            } else if (pathParts[0] === 'projects') {
              apiPath = 'projects';
              specificSlug = pathParts[1];
              isSpecificContent = true;
            }
          }
          
          // Fetch metadata based on path type
          let metadata;
          if (isSpecificContent) {
            // For blog posts and projects
            const url = specificSlug ? 
              '/api/' + pathParts[0] + '/' + specificSlug : 
              '/api/page-contents/' + apiPath;
              
            const response = await fetch(url);
            if (!response.ok) return null;
            
            const data = await response.json();
            
            // Create metadata for specific content
            metadata = {
              title: data.title ? data.title + ' | HAL149' : document.title,
              description: data.excerpt || data.description || document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
              keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
              canonical: 'https://hal149.com/' + path,
              ogTitle: data.title ? data.title + ' | HAL149' : document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
              ogDescription: data.excerpt || data.description || document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
              ogImage: data.image_url || document.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
            };
          } else {
            // For regular pages
            const response = await fetch('/api/page-contents/' + apiPath);
            if (!response.ok) return null;
            
            const data = await response.json();
            if (!data || !data.content) return null;
            
            const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
            metadata = content.metadata;
          }
          
          // Update metadata in the DOM
          if (metadata) {
            if (metadata.title) document.title = metadata.title;
            
            if (metadata.description) {
              let desc = document.querySelector('meta[name="description"]');
              if (desc) desc.setAttribute('content', metadata.description);
            }
            
            if (metadata.keywords) {
              let keywords = document.querySelector('meta[name="keywords"]');
              if (keywords) keywords.setAttribute('content', metadata.keywords);
            }
            
            if (metadata.ogTitle) {
              let ogTitle = document.querySelector('meta[property="og:title"]');
              if (ogTitle) ogTitle.setAttribute('content', metadata.ogTitle);
            }
            
            if (metadata.ogDescription) {
              let ogDesc = document.querySelector('meta[property="og:description"]');
              if (ogDesc) ogDesc.setAttribute('content', metadata.ogDescription);
            }
            
            if (metadata.ogImage) {
              let ogImage = document.querySelector('meta[property="og:image"]');
              if (ogImage) ogImage.setAttribute('content', metadata.ogImage);
            }
            
            if (metadata.canonical) {
              let canonical = document.querySelector('link[rel="canonical"]');
              if (canonical) canonical.setAttribute('href', metadata.canonical);
              
              let ogUrl = document.querySelector('meta[property="og:url"]');
              if (ogUrl) ogUrl.setAttribute('content', metadata.canonical);
            }
            
            console.log('Updated metadata for', path);
          }
        } catch (error) {
          console.error('Error updating metadata:', error);
        }
      }
      
      // Run metadata update when page loads
      fetchMetadata();
      
      // Also run on route changes for SPA navigation
      document.addEventListener('DOMContentLoaded', function() {
        // For Next.js history changes
        const pushState = history.pushState;
        history.pushState = function() {
          pushState.apply(this, arguments);
          fetchMetadata();
        };
        
        // For popstate (back/forward)
        window.addEventListener('popstate', fetchMetadata);
      });
    })();
  `;

  return (
    <Html lang="en">
      <Head>
        {/* Base metadata that will be visible to search engines on first load */}
        <meta name="description" content={defaultMetadata.description} />
        <meta name="keywords" content={defaultMetadata.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={defaultMetadata.ogTitle || defaultMetadata.title} />
        <meta property="og:description" content={defaultMetadata.ogDescription || defaultMetadata.description} />
        <meta property="og:image" content={defaultMetadata.ogImage} />
        <meta property="og:url" content={defaultMetadata.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultMetadata.ogTitle || defaultMetadata.title} />
        <meta name="twitter:description" content={defaultMetadata.ogDescription || defaultMetadata.description} />
        <meta name="twitter:image" content={defaultMetadata.ogImage} />
        
        {/* Canonical */}
        <link rel="canonical" href={defaultMetadata.canonical} />
        
        {/* Script to dynamically update metadata */}
        <script dangerouslySetInnerHTML={{ __html: injectMetadataScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}