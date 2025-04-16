/**
 * Static middleware for injecting meta tags
 * This middleware will immediately intercept requests for HTML pages
 * and inject the appropriate Open Graph tags based on the URL
 */
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { log } from './vite';

// Default meta tags that should be present on all pages
const DEFAULT_META_TAGS = `
  <!-- Basic Meta Tags -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
  
  <!-- Default Open Graph Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="HAL149" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="HAL149 | AI Agency" />
  <meta property="og:description" content="HAL149 is a premier AI agency creating next-generation artificial intelligence solutions." />
  <meta property="og:url" content="https://hal149.com/" />
  <meta property="og:image" content="https://hal149.com/og-image.png" />
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="HAL149 | AI Agency" />
  <meta name="twitter:description" content="HAL149 is a premier AI agency creating next-generation artificial intelligence solutions." />
  <meta name="twitter:image" content="https://hal149.com/og-image.png" />
`;

/**
 * Express middleware - adds the required HTML response handler
 */
export function staticMetaTags(req: Request, res: Response, next: NextFunction) {
  // Store the original send method
  const originalSend = res.send;
  
  // @ts-ignore - monkey-patch the send method
  res.send = function(body: any) {
    // Only process HTML responses
    if (typeof body === 'string' && body.includes('<!DOCTYPE html>')) {
      // Get the path
      const path = req.path;
      
      // Generate page-specific meta tags based on URL pattern
      let metaTags = DEFAULT_META_TAGS;
      
      // Blog post pattern
      if (path.startsWith('/blog/') && path.length > 6) {
        const blogSlug = path.substring(6).replace(/\/$/, '');
        // Override with blog-specific tags
        metaTags = `
          <!-- Basic Meta Tags -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="HAL149" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Blog Post | HAL149" />
          <meta property="og:description" content="Read our latest insights on artificial intelligence and technology." />
          <meta property="og:url" content="https://hal149.com${path}" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Blog Post | HAL149" />
          <meta name="twitter:description" content="Read our latest insights on artificial intelligence and technology." />
          <meta name="twitter:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // Project pattern
      else if (path.startsWith('/projects/') && path.length > 10) {
        const projectSlug = path.substring(10).replace(/\/$/, '');
        // Override with project-specific tags
        metaTags = `
          <!-- Basic Meta Tags -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="HAL149" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Project | HAL149" />
          <meta property="og:description" content="Explore our innovative AI projects and solutions." />
          <meta property="og:url" content="https://hal149.com${path}" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Project | HAL149" />
          <meta name="twitter:description" content="Explore our innovative AI projects and solutions." />
          <meta name="twitter:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // About page
      else if (path === '/about' || path === '/about/') {
        metaTags = `
          <!-- Basic Meta Tags -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="HAL149" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="About | HAL149" />
          <meta property="og:description" content="Learn about HAL149, our mission, and our team." />
          <meta property="og:url" content="https://hal149.com/about/" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="About | HAL149" />
          <meta name="twitter:description" content="Learn about HAL149, our mission, and our team." />
          <meta name="twitter:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // Contact page
      else if (path === '/contact' || path === '/contact/') {
        metaTags = `
          <!-- Basic Meta Tags -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="HAL149" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Contact | HAL149" />
          <meta property="og:description" content="Get in touch with HAL149 for AI solutions and services." />
          <meta property="og:url" content="https://hal149.com/contact/" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Contact | HAL149" />
          <meta name="twitter:description" content="Get in touch with HAL149 for AI solutions and services." />
          <meta name="twitter:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // Legal page
      else if (path === '/legal' || path === '/legal/') {
        metaTags = `
          <!-- Basic Meta Tags -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="HAL149" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Legal | HAL149" />
          <meta property="og:description" content="Legal information for HAL149 website." />
          <meta property="og:url" content="https://hal149.com/legal/" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Legal | HAL149" />
          <meta name="twitter:description" content="Legal information for HAL149 website." />
          <meta name="twitter:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // Blog listing page
      else if (path === '/blog' || path === '/blog/') {
        metaTags = `
          <!-- Basic Meta Tags -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="HAL149" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Blog | HAL149" />
          <meta property="og:description" content="Read our latest insights on artificial intelligence and technology." />
          <meta property="og:url" content="https://hal149.com/blog/" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Blog | HAL149" />
          <meta name="twitter:description" content="Read our latest insights on artificial intelligence and technology." />
          <meta name="twitter:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // Projects listing page
      else if (path === '/projects' || path === '/projects/') {
        metaTags = `
          <!-- Basic Meta Tags -->
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="HAL149" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="Projects | HAL149" />
          <meta property="og:description" content="Explore our innovative AI projects and solutions." />
          <meta property="og:url" content="https://hal149.com/projects/" />
          <meta property="og:image" content="https://hal149.com/og-image.png" />
          
          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Projects | HAL149" />
          <meta name="twitter:description" content="Explore our innovative AI projects and solutions." />
          <meta name="twitter:image" content="https://hal149.com/og-image.png" />
        `;
      }
      
      // Log meta tag injection
      log(`MetaTags: Injecting meta tags for ${req.path}`);
      
      // Simple injection - add meta tags after the head opening tag
      if (body.includes('<head>')) {
        body = body.replace('<head>', `<head>\n${metaTags}`);
      }
    }
    
    // Call the original send method
    return originalSend.call(res, body);
  };
  
  // Continue to the next middleware
  next();
}