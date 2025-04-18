// Custom Next.js server script
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const express = require('express');
const fetch = require('node-fetch');

// Set development mode based on environment
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Function to fetch metadata for a page from the API
async function fetchMetadata(page, specificSlug = null) {
  try {
    let apiUrl = '';
    let isSpecificContent = false;
    
    // Determine if we're fetching a specific blog post or project
    if (specificSlug && (page === 'blog' || page === 'projects')) {
      if (page === 'blog') {
        apiUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/blog/${specificSlug}`;
        isSpecificContent = true;
      } else if (page === 'projects') {
        apiUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/projects/slug/${specificSlug}`;
        isSpecificContent = true;
      }
    } else {
      // Regular page content
      apiUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/page-contents/${page}`;
    }
    
    console.log(`Fetching metadata from: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Error fetching metadata for ${page}${specificSlug ? '/' + specificSlug : ''}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    if (!data) {
      console.warn(`No data found for ${page}${specificSlug ? '/' + specificSlug : ''}`);
      return null;
    }
    
    // Handle different response formats
    if (isSpecificContent) {
      // Blog posts and projects have their own structure
      const metadata = {
        title: data.title ? `${data.title} | HAL149` : defaultMetadata.title,
        description: data.excerpt || data.description || defaultMetadata.description,
        keywords: data.keywords || defaultMetadata.keywords,
        canonical: `https://hal149.com/${page}/${data.slug || specificSlug}`,
        ogTitle: data.title ? `${data.title} | HAL149` : defaultMetadata.ogTitle,
        ogDescription: data.excerpt || data.description || defaultMetadata.ogDescription,
        ogImage: data.image_url || defaultMetadata.ogImage
      };
      console.log(`Successfully created metadata for ${page}/${specificSlug}:`, metadata);
      return metadata;
    } else {
      // Regular page content
      if (!data.content) {
        console.warn(`No content found for ${page}`);
        return null;
      }
      
      const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      
      console.log(`Successfully fetched metadata for ${page}:`, content.metadata);
      return content.metadata || null;
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

// Default metadata to use if API fetch fails
const defaultMetadata = {
  title: 'HAL149 | Unlocking Your Business Potential with AI',
  description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  canonical: 'https://hal149.com',
  ogTitle: 'HAL149 | Unlocking Your Business Potential with AI',
  ogDescription: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
  ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
};

// Simple function to sanitize strings to prevent XSS
function sanitizeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Function to generate meta tags HTML from metadata object
function generateMetaTags(metadata) {
  if (!metadata) metadata = defaultMetadata;
  
  // Sanitize all metadata values
  const title = sanitizeHTML(metadata.title || defaultMetadata.title);
  const description = sanitizeHTML(metadata.description || defaultMetadata.description);
  const keywords = sanitizeHTML(metadata.keywords || defaultMetadata.keywords);
  const ogTitle = sanitizeHTML(metadata.ogTitle || metadata.title || defaultMetadata.ogTitle);
  const ogDescription = sanitizeHTML(metadata.ogDescription || metadata.description || defaultMetadata.ogDescription);
  const ogImage = sanitizeHTML(metadata.ogImage || defaultMetadata.ogImage);
  const canonical = sanitizeHTML(metadata.canonical || defaultMetadata.canonical);
  
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    
    <!-- Canonical -->
    <link rel="canonical" href="${canonical}" />
  `;
}

// Start the server after Next.js is ready
app.prepare().then(() => {
  const server = express();
  
  // Middleware to inject metadata
  server.use(async (req, res, next) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    
    // Get page name from path
    let pagePath = 'home';
    let specificSlug = null;
    
    if (pathname !== '/') {
      // Remove leading and trailing slashes, then split by remaining slashes
      const pathParts = pathname.replace(/^\/+|\/+$/g, '').split('/');
      
      if (pathParts.length >= 1) {
        // First level is the main page (blog, projects, etc.)
        pagePath = pathParts[0];
        
        // Special handling for blog posts and project pages
        if (pathParts.length >= 2) {
          if (pagePath === 'blog') {
            // For blog posts, try to fetch specific post metadata
            specificSlug = pathParts[1];
            console.log(`Detected blog post: ${specificSlug}`);
          } else if (pagePath === 'projects') {
            // For project pages, try to fetch specific project metadata
            specificSlug = pathParts[1];
            console.log(`Detected project page: ${specificSlug}`);
          }
        }
      }
    }
    
    console.log(`Resolved page path: ${pathname} -> ${pagePath}${specificSlug ? '/' + specificSlug : ''}`);
    
    // Only inject HTML for page requests, not for API or static assets
    if (
      !pathname.startsWith('/_next') && 
      !pathname.startsWith('/api') && 
      !pathname.includes('.') &&
      req.method === 'GET'
    ) {
      const originalRenderPage = app.renderToHTML.bind(app);
      
      // Override the renderToHTML method for this request only
      app.renderToHTML = async (req, res, pathname, query) => {
        // Fetch metadata from API
        const metadata = await fetchMetadata(pagePath, specificSlug) || defaultMetadata;
        
        // Get the original HTML
        let html = await originalRenderPage(req, res, pathname, query);
        
        // Insert meta tags
        const metaTags = generateMetaTags(metadata);
        html = html.replace('<head>', `<head>\n    ${metaTags}`);
        
        return html;
      };
    }
    
    next();
  });
  
  // Let Next.js handle all requests
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Start server
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});