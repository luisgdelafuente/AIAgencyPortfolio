/**
 * Direct SEO Middleware - Gets metadata directly from the database without hardcoded values
 */
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { log } from './vite';

// Basic meta tags that must be present on all pages
const BASIC_META_TAGS = `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
`;

/**
 * Express middleware - adds the required HTML response handler
 */
export function staticMetaTags(req: Request, res: Response, next: NextFunction) {
  // Store the original send method
  const originalSend = res.send;
  
  // Override the send method
  res.send = async function(body: any) {
    // Only process HTML responses
    if (typeof body === 'string' && body.includes('<!DOCTYPE html>')) {
      try {
        // Get the current path
        const path = req.path;
        let pageName = '';
        
        // Determine what content to load
        let pageData = null;
        let contentType = 'website';
        
        // Blog post page
        if (path.startsWith('/blog/') && path.length > 6) {
          const blogSlug = path.substring(6).replace(/\/$/, '');
          pageData = await storage.getBlogPostBySlug(blogSlug);
          contentType = 'article';
          pageName = 'blog';
        } 
        // Project page
        else if (path.startsWith('/projects/') && path.length > 10) {
          const projectSlug = path.substring(10).replace(/\/$/, '');
          pageData = await storage.getProjectBySlug(projectSlug);
          contentType = 'article';
          pageName = 'projects';
        }
        // Regular page
        else {
          pageName = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '');
        }
        
        // Get page content from database
        const pageContent = await storage.getPageContent(pageName);
        
        // Extract metadata
        let metadata = {
          title: '',
          description: '',
          keywords: '',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          ogSiteName: '',
          ogLogo: ''
        };
        
        // Parse page metadata from database content
        if (pageContent && pageContent.content) {
          try {
            const content = JSON.parse(pageContent.content);
            if (content.metadata) {
              metadata = { ...metadata, ...content.metadata };
            }
          } catch (e) {
            log(`Error parsing page content: ${e}`);
          }
        }
        
        // Override with specific page data if available
        if (pageData) {
          // For blog posts and projects
          metadata.title = pageData.title || metadata.title;
          metadata.description = pageData.excerpt || pageData.description || metadata.description;
          
          // Use imageUrl or image_url if available
          if (pageData.imageUrl || pageData.image_url) {
            metadata.ogImage = pageData.imageUrl || pageData.image_url || metadata.ogImage;
          }
          
          // If content contains embedded metadata, use it
          if (pageData.content && typeof pageData.content === 'string') {
            try {
              if (pageData.content.startsWith('{')) {
                const contentObj = JSON.parse(pageData.content);
                if (contentObj.metadata) {
                  metadata = { ...metadata, ...contentObj.metadata };
                }
              }
            } catch (e) {
              log(`Error parsing content metadata: ${e}`);
            }
          }
        }
        
        // Ensure og values are set if regular values are available
        metadata.ogTitle = metadata.ogTitle || metadata.title;
        metadata.ogDescription = metadata.ogDescription || metadata.description;
        
        // Build canonical URL
        const host = req.headers.host || process.env.REPLIT_DOMAIN || '';
        const canonical = metadata.canonical || `https://${host}${path.endsWith('/') ? path : path + '/'}`;
        
        // Build final meta tags HTML
        const metaTags = `
          ${BASIC_META_TAGS}
          
          <!-- SEO Meta Tags -->
          ${metadata.title ? `<title>${metadata.title}</title>` : ''}
          ${metadata.description ? `<meta name="description" content="${metadata.description}" />` : ''}
          ${metadata.keywords ? `<meta name="keywords" content="${metadata.keywords}" />` : ''}
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="${contentType}" />
          ${metadata.ogTitle ? `<meta property="og:title" content="${metadata.ogTitle}" />` : ''}
          ${metadata.ogDescription ? `<meta property="og:description" content="${metadata.ogDescription}" />` : ''}
          ${metadata.ogImage ? `<meta property="og:image" content="${metadata.ogImage}" />` : ''}
          <meta property="og:url" content="${canonical}" />
          ${metadata.ogSiteName ? `<meta property="og:site_name" content="${metadata.ogSiteName}" />` : ''}
          ${metadata.ogLogo ? `<meta property="og:logo" content="${metadata.ogLogo}" />` : ''}
          
          <!-- Twitter Card -->
          <meta name="twitter:card" content="${metadata.ogImage ? 'summary_large_image' : 'summary'}" />
          ${metadata.ogTitle ? `<meta name="twitter:title" content="${metadata.ogTitle}" />` : ''}
          ${metadata.ogDescription ? `<meta name="twitter:description" content="${metadata.ogDescription}" />` : ''}
          ${metadata.ogImage ? `<meta name="twitter:image" content="${metadata.ogImage}" />` : ''}
          
          <!-- Canonical URL -->
          <link rel="canonical" href="${canonical}" />
        `;
        
        // Inject meta tags into HTML
        if (body.includes('<head>')) {
          body = body.replace('<head>', `<head>\n${metaTags}`);
          log(`Injected meta tags for ${path}`);
        }
      } catch (error) {
        log(`Error injecting meta tags: ${error}`);
      }
    }
    
    // Call original send method
    return originalSend.call(res, body);
  };
  
  next();
}