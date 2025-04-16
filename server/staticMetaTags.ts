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
      // Log meta tag injection
      log(`MetaTags: Injecting static meta tags for ${req.path}`);
      
      // Simple injection - add meta tags after the head opening tag
      if (body.includes('<head>')) {
        body = body.replace('<head>', `<head>\n${DEFAULT_META_TAGS}`);
      }
    }
    
    // Call the original send method
    return originalSend.call(res, body);
  };
  
  // Continue to the next middleware
  next();
}