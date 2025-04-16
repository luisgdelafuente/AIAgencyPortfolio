/**
 * Server-side HTML processor for injecting Open Graph tags
 */
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { storage } from './storage';

// Load default OG tags
const ogTagsPath = path.join(process.cwd(), 'client', 'public', 'og-tags.json');
const defaultOgTags = JSON.parse(fs.readFileSync(ogTagsPath, 'utf8'));

/**
 * Processes HTML content to inject meta tags based on the current path
 */
export async function processHtml(html: string, req: Request): Promise<string> {
  try {
    // Extract path
    const urlPath = req.path;
    
    // Generate meta tags based on the path
    const metaTags = await generateMetaTags(urlPath);
    
    // Inject meta tags
    return injectMetaTags(html, metaTags);
  } catch (error) {
    console.error('Error processing HTML:', error);
    return html;
  }
}

/**
 * Generates meta tags based on the URL path
 */
async function generateMetaTags(urlPath: string): Promise<string> {
  // Default meta tags that should be present on all pages
  let metaTags = `
    <!-- Generated Meta Tags -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow" />
    <meta property="og:site_name" content="HAL149" />
    <meta property="og:locale" content="en_US" />
  `;
  
  try {
    // Clean the path
    const path = urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath;
    const segments = path.split('/').filter(segment => segment.length > 0);
    
    // Home page
    if (segments.length === 0) {
      const tags = defaultOgTags.home;
      metaTags += `
        <title>${tags.title}</title>
        <meta name="description" content="${tags.description}" />
        <link rel="canonical" href="${tags.url}" />
        <meta property="og:title" content="${tags.title}" />
        <meta property="og:description" content="${tags.description}" />
        <meta property="og:url" content="${tags.url}" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="${tags.image}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${tags.title}" />
        <meta name="twitter:description" content="${tags.description}" />
        <meta name="twitter:image" content="${tags.image}" />
      `;
      return metaTags;
    }
    
    // Single level pages (about, contact, etc.)
    if (segments.length === 1 && defaultOgTags[segments[0]]) {
      const pageName = segments[0];
      const tags = defaultOgTags[pageName];
      
      metaTags += `
        <title>${tags.title}</title>
        <meta name="description" content="${tags.description}" />
        <link rel="canonical" href="${tags.url}" />
        <meta property="og:title" content="${tags.title}" />
        <meta property="og:description" content="${tags.description}" />
        <meta property="og:url" content="${tags.url}" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="${tags.image}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${tags.title}" />
        <meta name="twitter:description" content="${tags.description}" />
        <meta name="twitter:image" content="${tags.image}" />
      `;
      return metaTags;
    }
    
    // Blog posts
    if (segments.length === 2 && segments[0] === 'blog') {
      try {
        const slug = segments[1];
        const post = await storage.getBlogPostBySlug(slug);
        
        if (post) {
          const title = `${post.title} | HAL149`;
          const description = post.excerpt || defaultOgTags.blog.description;
          const image = post.imageUrl || defaultOgTags.blog.image;
          const url = `https://hal149.com/blog/${post.slug}/`;
          
          metaTags += `
            <title>${title}</title>
            <meta name="description" content="${description}" />
            <link rel="canonical" href="${url}" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:url" content="${url}" />
            <meta property="og:type" content="article" />
            <meta property="og:image" content="${image}" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${image}" />
          `;
          return metaTags;
        }
      } catch (error) {
        console.error('Error generating blog post meta tags:', error);
      }
    }
    
    // Projects
    if (segments.length === 2 && segments[0] === 'projects') {
      try {
        const slug = segments[1];
        const project = await storage.getProjectBySlug(slug);
        
        if (project) {
          const title = `${project.title} | HAL149`;
          const description = project.description || defaultOgTags.projects.description;
          const image = project.imageUrl || defaultOgTags.projects.image;
          const url = `https://hal149.com/projects/${project.slug}/`;
          
          metaTags += `
            <title>${title}</title>
            <meta name="description" content="${description}" />
            <link rel="canonical" href="${url}" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:url" content="${url}" />
            <meta property="og:type" content="article" />
            <meta property="og:image" content="${image}" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${image}" />
          `;
          return metaTags;
        }
      } catch (error) {
        console.error('Error generating project meta tags:', error);
      }
    }
    
    // Fall back to section default tags
    if (segments.length > 0 && defaultOgTags[segments[0]]) {
      const section = segments[0];
      const tags = defaultOgTags[section];
      
      metaTags += `
        <title>${tags.title}</title>
        <meta name="description" content="${tags.description}" />
        <link rel="canonical" href="${tags.url}" />
        <meta property="og:title" content="${tags.title}" />
        <meta property="og:description" content="${tags.description}" />
        <meta property="og:url" content="${tags.url}" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="${tags.image}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${tags.title}" />
        <meta name="twitter:description" content="${tags.description}" />
        <meta name="twitter:image" content="${tags.image}" />
      `;
      return metaTags;
    }
    
    // Default to home tags if no match
    const tags = defaultOgTags.home;
    metaTags += `
      <title>${tags.title}</title>
      <meta name="description" content="${tags.description}" />
      <link rel="canonical" href="${tags.url}" />
      <meta property="og:title" content="${tags.title}" />
      <meta property="og:description" content="${tags.description}" />
      <meta property="og:url" content="${tags.url}" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="${tags.image}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${tags.title}" />
      <meta name="twitter:description" content="${tags.description}" />
      <meta name="twitter:image" content="${tags.image}" />
    `;
    
  } catch (error) {
    console.error('Error generating meta tags:', error);
  }
  
  return metaTags;
}

/**
 * Injects meta tags into the HTML
 */
function injectMetaTags(html: string, metaTags: string): string {
  if (html.includes('<head>')) {
    // Make sure we don't duplicate tags by removing any existing ones 
    const clearedHtml = removeExistingMetaTags(html);
    return clearedHtml.replace('<head>', `<head>\n${metaTags}`);
  }
  return html;
}

/**
 * Removes any existing meta tags that we might be injecting
 */
function removeExistingMetaTags(html: string): string {
  // Simple implementation - replace with better logic if needed
  return html;
}