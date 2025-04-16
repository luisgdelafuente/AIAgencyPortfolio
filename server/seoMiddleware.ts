/**
 * SEO Middleware for Express
 * Injects Open Graph and other meta tags directly into HTML responses
 */
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { BlogPost, Project } from '@shared/schema';
import { log } from './vite';

/**
 * Express middleware that injects meta tags into HTML responses
 */
export function injectMetaTags(req: Request, res: Response, next: NextFunction) {
  console.log(`SEO Middleware triggered for: ${req.path}`); // Add this console log
  
  const originalSend = res.send;
  
  // @ts-ignore - Override the send method with a sync version for simplicity
  res.send = function(body: any): Response {
    console.log(`SEO: Response send called for ${req.path}, is HTML: ${typeof body === 'string' && body.includes('<!DOCTYPE html>')}`);
    
    if (typeof body === 'string' && body.includes('<!DOCTYPE html>')) {
      console.log(`SEO: Processing HTML response for ${req.path}`); // Add more detailed logging
      
      // Let's log the actual send content for debugging
      if (typeof body === 'string') {
        console.log(`HTML before injection (first 300 chars): ${body.substring(0, 300)}`);
      }
      
      // Default meta tags
      let metaTags = `
        <!-- Base Meta Tags -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta property="og:site_name" content="HAL149" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
      `;
      
      // Add page-specific tags based on URL pattern
      const path = req.path;
      
      // Home page
      if (path === '/' || path === '') {
        metaTags += `
          <title>HAL149 | AI Agency</title>
          <meta name="description" content="HAL149 is a premier AI agency creating next-generation artificial intelligence solutions." />
          <meta property="og:title" content="HAL149 | AI Agency" />
          <meta property="og:description" content="HAL149 is a premier AI agency creating next-generation artificial intelligence solutions." />
          <meta property="og:url" content="https://hal149.com/" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // Blog post pattern
      else if (path.startsWith('/blog/') && path.length > 6) {
        const blogSlug = path.substring(6).replace(/\/$/, '');
        metaTags += `
          <title>Blog Post | HAL149</title>
          <meta name="description" content="Read our latest insights on artificial intelligence and technology." />
          <meta property="og:title" content="Blog Post | HAL149" />
          <meta property="og:description" content="Read our latest insights on artificial intelligence and technology." />
          <meta property="og:url" content="https://hal149.com${path}" />
          <meta property="og:type" content="article" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          <meta name="twitter:title" content="Blog Post | HAL149" />
          <meta name="twitter:description" content="Read our latest insights on artificial intelligence and technology." />
        `;
      }
      
      // Project pattern
      else if (path.startsWith('/projects/') && path.length > 10) {
        const projectSlug = path.substring(10).replace(/\/$/, '');
        metaTags += `
          <title>Project | HAL149</title>
          <meta name="description" content="Explore our innovative AI projects and solutions." />
          <meta property="og:title" content="Project | HAL149" />
          <meta property="og:description" content="Explore our innovative AI projects and solutions." />
          <meta property="og:url" content="https://hal149.com${path}" />
          <meta property="og:type" content="article" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          <meta name="twitter:title" content="Project | HAL149" />
          <meta name="twitter:description" content="Explore our innovative AI projects and solutions." />
        `;
      }
      
      // About page
      else if (path === '/about' || path === '/about/') {
        metaTags += `
          <title>About | HAL149</title>
          <meta name="description" content="Learn about HAL149, our mission, and our team." />
          <meta property="og:title" content="About | HAL149" />
          <meta property="og:description" content="Learn about HAL149, our mission, and our team." />
          <meta property="og:url" content="https://hal149.com/about/" />
          <meta property="og:type" content="website" />
        `;
      }
      
      // Contact page
      else if (path === '/contact' || path === '/contact/') {
        metaTags += `
          <title>Contact | HAL149</title>
          <meta name="description" content="Get in touch with HAL149 for AI solutions and services." />
          <meta property="og:title" content="Contact | HAL149" />
          <meta property="og:description" content="Get in touch with HAL149 for AI solutions and services." />
          <meta property="og:url" content="https://hal149.com/contact/" />
          <meta property="og:type" content="website" />
        `;
      }
      
      // Legal page
      else if (path === '/legal' || path === '/legal/') {
        metaTags += `
          <title>Legal | HAL149</title>
          <meta name="description" content="Legal information for HAL149 website." />
          <meta property="og:title" content="Legal | HAL149" />
          <meta property="og:description" content="Legal information for HAL149 website." />
          <meta property="og:url" content="https://hal149.com/legal/" />
          <meta property="og:type" content="website" />
        `;
      }
      
      // Inject the meta tags
      if (body.includes('<head>')) {
        log(`SEO: Injecting meta tags for ${req.path}`);
        body = body.replace('<head>', `<head>\n${metaTags}`);
      }
    }
    
    return originalSend.call(res, body);
  };
  
  next();
}

/**
 * Determines what meta tags to add based on the current URL path
 */
async function getMetaTagsForPath(path: string): Promise<string> {
  // Base meta tags for all pages
  let tags = `
    <!-- Base Meta Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <meta name="robots" content="index, follow" />
    
    <!-- Default Open Graph Tags -->
    <meta property="og:site_name" content="HAL149" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
  `;
  
  // Clean the path
  path = path.endsWith('/') ? path.slice(0, -1) : path;
  
  try {
    // Split path segments
    const segments = path.split('/').filter(segment => segment.length > 0);
    
    if (segments.length === 0) {
      // Home page
      const homeContent = await storage.getPageContent('home');
      if (homeContent?.content) {
        try {
          const contentObj = JSON.parse(homeContent.content);
          if (contentObj.metadata) {
            const metadata = contentObj.metadata;
            const title = metadata.title || 'HAL149';
            const description = metadata.description || '';
            const canonical = `https://hal149.com/`;
            
            tags += `
              <title>${escapeHtml(title)}</title>
              <meta name="description" content="${escapeHtml(description)}" />
              <link rel="canonical" href="${canonical}" />
              <meta property="og:title" content="${escapeHtml(metadata.ogTitle || title)}" />
              <meta property="og:description" content="${escapeHtml(metadata.ogDescription || description)}" />
              <meta property="og:url" content="${canonical}" />
              <meta property="og:type" content="website" />
            `;
            
            if (metadata.ogImage) {
              tags += `<meta property="og:image" content="${escapeHtml(metadata.ogImage)}" />`;
              tags += `<meta name="twitter:image" content="${escapeHtml(metadata.ogImage)}" />`;
            }
          }
        } catch (e) {
          console.error('Error parsing home page content:', e);
        }
      }
      
      return tags;
    }
    
    // Check if this is a blog post
    if (segments.length === 2 && segments[0] === 'blog') {
      const slug = segments[1];
      const post = await storage.getBlogPostBySlug(slug);
      
      if (post) {
        return tags + await generateBlogPostMetaTags(post);
      }
    }
    
    // Check if this is a project detail page
    if (segments.length === 2 && segments[0] === 'projects') {
      const slug = segments[1];
      const project = await storage.getProjectBySlug(slug);
      
      if (project) {
        return tags + await generateProjectMetaTags(project);
      }
    }
    
    // For other pages, try to get content from page_contents table
    if (segments.length === 1) {
      const pageName = segments[0];
      const pageContent = await storage.getPageContent(pageName);
      
      if (pageContent?.content) {
        try {
          const contentObj = JSON.parse(pageContent.content);
          if (contentObj.metadata) {
            const metadata = contentObj.metadata;
            const title = metadata.title || `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | HAL149`;
            const description = metadata.description || '';
            const canonical = `https://hal149.com/${pageName}/`;
            
            tags += `
              <title>${escapeHtml(title)}</title>
              <meta name="description" content="${escapeHtml(description)}" />
              <link rel="canonical" href="${canonical}" />
              <meta property="og:title" content="${escapeHtml(metadata.ogTitle || title)}" />
              <meta property="og:description" content="${escapeHtml(metadata.ogDescription || description)}" />
              <meta property="og:url" content="${canonical}" />
              <meta property="og:type" content="website" />
            `;
            
            if (metadata.ogImage) {
              tags += `<meta property="og:image" content="${escapeHtml(metadata.ogImage)}" />`;
              tags += `<meta name="twitter:image" content="${escapeHtml(metadata.ogImage)}" />`;
            }
          }
        } catch (e) {
          console.error(`Error parsing ${pageName} page content:`, e);
        }
      }
    }
  } catch (error) {
    console.error('Error generating path-specific meta tags:', error);
  }
  
  return tags;
}

/**
 * Generate meta tags for a blog post
 */
async function generateBlogPostMetaTags(post: BlogPost): Promise<string> {
  let metaTags = '';
  const title = `${post.title} | HAL149`;
  const description = post.excerpt || '';
  const imageUrl = post.imageUrl || '';
  const canonical = `https://hal149.com/blog/${post.slug}/`;
  
  // Try to extract additional metadata from content
  let customMetadata: Record<string, string> = {};
  
  try {
    if (typeof post.content === 'string' && post.content.trim().startsWith('{')) {
      const contentObj = JSON.parse(post.content);
      if (contentObj.metadata) {
        customMetadata = contentObj.metadata;
      }
    }
  } catch (e) {
    console.error('Error parsing blog post content metadata:', e);
  }
  
  // Generate the meta tags
  metaTags += `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(customMetadata.ogTitle || title)}" />
    <meta property="og:description" content="${escapeHtml(customMetadata.ogDescription || description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
  `;
  
  if (imageUrl || customMetadata.ogImage) {
    const image = customMetadata.ogImage || imageUrl;
    metaTags += `<meta property="og:image" content="${escapeHtml(image)}" />`;
    metaTags += `<meta name="twitter:image" content="${escapeHtml(image)}" />`;
  }
  
  // Add Twitter specific tags
  metaTags += `
    <meta name="twitter:title" content="${escapeHtml(customMetadata.ogTitle || title)}" />
    <meta name="twitter:description" content="${escapeHtml(customMetadata.ogDescription || description)}" />
  `;
  
  return metaTags;
}

/**
 * Generate meta tags for a project
 */
async function generateProjectMetaTags(project: Project): Promise<string> {
  let metaTags = '';
  const title = `${project.title} | HAL149`;
  const description = project.description || '';
  const imageUrl = project.imageUrl || '';
  const canonical = `https://hal149.com/projects/${project.slug}/`;
  
  // Try to extract additional metadata from content
  let customMetadata: Record<string, string> = {};
  
  try {
    if (typeof project.content === 'string' && project.content.trim().startsWith('{')) {
      const contentObj = JSON.parse(project.content);
      if (contentObj.metadata) {
        customMetadata = contentObj.metadata;
      }
    }
  } catch (e) {
    console.error('Error parsing project content metadata:', e);
  }
  
  // Generate the meta tags
  metaTags += `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(customMetadata.ogTitle || title)}" />
    <meta property="og:description" content="${escapeHtml(customMetadata.ogDescription || description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
  `;
  
  if (imageUrl || customMetadata.ogImage) {
    const image = customMetadata.ogImage || imageUrl;
    metaTags += `<meta property="og:image" content="${escapeHtml(image)}" />`;
    metaTags += `<meta name="twitter:image" content="${escapeHtml(image)}" />`;
  }
  
  // Add Twitter specific tags
  metaTags += `
    <meta name="twitter:title" content="${escapeHtml(customMetadata.ogTitle || title)}" />
    <meta name="twitter:description" content="${escapeHtml(customMetadata.ogDescription || description)}" />
  `;
  
  return metaTags;
}

/**
 * Injects meta tags into the HTML head
 */
function injectTags(html: string, metaTags: string): string {
  // Check if head tag exists
  if (html.includes('<head>')) {
    // Insert meta tags after the head tag
    return html.replace('<head>', `<head>\n${metaTags}`);
  }
  
  return html;
}

/**
 * Escape HTML entities in a string to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}