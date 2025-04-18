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
async function fetchMetadata(page) {
  try {
    // API is available at same origin during SSR
    const apiUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/page-contents/${page}`;
    console.log(`Fetching metadata from: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Error fetching metadata for ${page}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    if (!data || !data.content) {
      console.warn(`No content found for ${page}`);
      return null;
    }
    
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    
    console.log(`Successfully fetched metadata for ${page}:`, content.metadata);
    return content.metadata || null;
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

// Function to generate meta tags HTML from metadata object
function generateMetaTags(metadata) {
  if (!metadata) metadata = defaultMetadata;
  
  return `
    <title>${metadata.title || defaultMetadata.title}</title>
    <meta name="description" content="${metadata.description || defaultMetadata.description}" />
    <meta name="keywords" content="${metadata.keywords || defaultMetadata.keywords}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${metadata.ogTitle || metadata.title || defaultMetadata.ogTitle}" />
    <meta property="og:description" content="${metadata.ogDescription || metadata.description || defaultMetadata.ogDescription}" />
    <meta property="og:image" content="${metadata.ogImage || defaultMetadata.ogImage}" />
    <meta property="og:url" content="${metadata.canonical || defaultMetadata.canonical}" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${metadata.ogTitle || metadata.title || defaultMetadata.ogTitle}" />
    <meta name="twitter:description" content="${metadata.ogDescription || metadata.description || defaultMetadata.ogDescription}" />
    <meta name="twitter:image" content="${metadata.ogImage || defaultMetadata.ogImage}" />
    
    <!-- Canonical -->
    <link rel="canonical" href="${metadata.canonical || defaultMetadata.canonical}" />
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
    const pagePath = pathname === '/' ? 'home' : pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
    
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
        const metadata = await fetchMetadata(pagePath) || defaultMetadata;
        
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