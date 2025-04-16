/**
 * Static middleware for injecting meta tags
 * This middleware will immediately intercept requests for HTML pages
 * and inject the appropriate Open Graph tags based on the URL
 */
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { log } from './vite';

// We'll get the meta tags dynamically for each page
const BASIC_META_TAGS = `
  <!-- Basic Meta Tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
`;

/**
 * Helper function to extract metadata from JSON content
 */
async function extractMetadata(pageName: string, data?: any): Promise<any> {
  let metadata: any = {
    title: '',
    description: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    ogSiteName: '',
    ogLogo: ''
  };
  
  try {
    // Get page content from the database
    const pageContent = await storage.getPageContent(pageName);
    
    if (pageContent && pageContent.content) {
      // Parse the JSON content
      const content = typeof pageContent.content === 'string' 
        ? JSON.parse(pageContent.content) 
        : pageContent.content;
      
      // Extract metadata from the content if it exists
      if (content.metadata) {
        metadata = {
          ...metadata,
          ...content.metadata
        };
      }
    }
    
    // Merge with any additional data provided
    if (data) {
      if (data.title) metadata.title = data.title;
      if (data.description) metadata.description = data.description || data.excerpt;
      if (data.ogTitle) metadata.ogTitle = data.ogTitle;
      if (data.ogDescription) metadata.ogDescription = data.ogDescription;
      if (data.ogImage) metadata.ogImage = data.ogImage;
      if (data.imageUrl) metadata.ogImage = metadata.ogImage || data.imageUrl;
      if (data.image_url) metadata.ogImage = metadata.ogImage || data.image_url;
    }
    
    // Set defaults for OG properties if not set
    metadata.ogTitle = metadata.ogTitle || metadata.title;
    metadata.ogDescription = metadata.ogDescription || metadata.description;
  } catch (error) {
    log(`Error extracting metadata for ${pageName}: ${error}`);
  }
  
  return metadata;
}

/**
 * Generate HTML meta tags for a page
 */
function generateMetaTagsHtml(metadata: any, path: string, type: string = 'website', req?: Request): string {
  // Ensure we have the necessary values
  const title = metadata.title || '';
  const description = metadata.description || '';
  const ogTitle = metadata.ogTitle || title;
  const ogDescription = metadata.ogDescription || description;
  const ogImage = metadata.ogImage || '';
  const ogSiteName = metadata.ogSiteName || '';
  const ogLogo = metadata.ogLogo || '';
  
  // Base URL for canonical links - avoid hardcoding the domain
  const host = req?.headers?.host || process.env.REPLIT_DOMAIN || 'example.com';
  const baseUrl = `https://${host}`;
  const canonicalUrl = `${baseUrl}${path.endsWith('/') ? path : path + '/'}`;
  
  return `
    ${BASIC_META_TAGS}
    
    <!-- SEO Meta Tags -->
    ${title ? `<title>${title}</title>` : ''}
    ${description ? `<meta name="description" content="${description}" />` : ''}
    ${metadata.keywords ? `<meta name="keywords" content="${metadata.keywords}" />` : ''}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}" />
    ${ogTitle ? `<meta property="og:title" content="${ogTitle}" />` : ''}
    ${ogDescription ? `<meta property="og:description" content="${ogDescription}" />` : ''}
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
    <meta property="og:url" content="${canonicalUrl}" />
    ${ogSiteName ? `<meta property="og:site_name" content="${ogSiteName}" />` : ''}
    ${ogLogo ? `<meta property="og:logo" content="${ogLogo}" />` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />
    ${ogTitle ? `<meta name="twitter:title" content="${ogTitle}" />` : ''}
    ${ogDescription ? `<meta name="twitter:description" content="${ogDescription}" />` : ''}
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ''}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}" />
  `;
}

/**
 * Express middleware - adds the required HTML response handler
 */
export function staticMetaTags(req: Request, res: Response, next: NextFunction) {
  // Store the original send method
  const originalSend = res.send;
  
  // @ts-ignore - monkey-patch the send method
  res.send = async function(body: any) {
    // Only process HTML responses
    if (typeof body === 'string' && body.includes('<!DOCTYPE html>')) {
      try {
        // Get the path
        const path = req.path;
        
        // Default meta tags (will be overridden later)
        let metaTags = '';
        
        // Blog post pattern
        if (path.startsWith('/blog/') && path.length > 6) {
          const blogSlug = path.substring(6).replace(/\/$/, '');
          
          // Get the blog post from database
          const blogPost = await storage.getBlogPostBySlug(blogSlug);
          
          if (blogPost) {
            // Extract metadata from the blog post
            const metadata = await extractMetadata('blog', blogPost);
            
            // Generate meta tags HTML
            metaTags = generateMetaTagsHtml(metadata, path, 'article', req);
          } else {
            // Fallback to blog page metadata
            const metadata = await extractMetadata('blog');
            metaTags = generateMetaTagsHtml(metadata, path, 'website', req);
          }
        }
        
        // Project pattern
        else if (path.startsWith('/projects/') && path.length > 10) {
          const projectSlug = path.substring(10).replace(/\/$/, '');
          
          // Get the project from database
          const project = await storage.getProjectBySlug(projectSlug);
          
          if (project) {
            // Extract metadata from the project
            const metadata = await extractMetadata('projects', project);
            
            // Generate meta tags HTML
            metaTags = generateMetaTagsHtml(metadata, path, 'article', req);
          } else {
            // Fallback to projects page metadata
            const metadata = await extractMetadata('projects');
            metaTags = generateMetaTagsHtml(metadata, path, 'website', req);
          }
        }
        
        // Regular pages with database content
        else {
          // Extract page name from path
          let pageName = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '');
          
          // Get metadata for the page
          const metadata = await extractMetadata(pageName);
          
          // Generate meta tags HTML
          metaTags = generateMetaTagsHtml(metadata, path, 'website', req);
        }
        
        // Log meta tag injection
        log(`MetaTags: Injecting meta tags for ${req.path}`);
        
        // Simple injection - add meta tags after the head opening tag
        if (body.includes('<head>')) {
          body = body.replace('<head>', `<head>\n${metaTags}`);
        }
      } catch (error) {
        log(`Error generating meta tags: ${error}`);
      }
    }
    
    // Call the original send method
    return originalSend.call(res, body);
  };
  
  // Continue to the next middleware
  next();
}