/**
 * This script initializes the metadata for blog and projects pages
 * in the database if they don't already exist.
 */

import { db } from '../server/db.js';
import { pageContents } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function initializePageMetadata() {
  console.log('Initializing page metadata...');
  
  try {
    // Check if the blog page content exists
    const blogPage = await db.query.pageContents.findFirst({
      where: eq(pageContents.page, 'blog')
    });
    
    // If not, create default blog page content
    if (!blogPage) {
      console.log('Creating default blog page content...');
      
      const blogContent = {
        blogTitle: 'Blog - HAL149',
        blogSubtitle: 'Latest insights and updates from HAL149',
        metadata: {
          title: 'AI Blog - Next-Generation Insights | HAL149',
          description: 'Explore the latest advances in artificial intelligence, machine learning, and data insights from HAL149\'s research team.',
          keywords: 'AI blog, machine learning blog, artificial intelligence insights, HAL149 research',
          canonical: 'https://test.hal149.com/blog/',
          ogTitle: 'HAL149 AI Blog - Next-Generation Insights',
          ogDescription: 'Cutting-edge insights on AI, machine learning, and automation from industry experts.',
          ogImage: 'https://test.hal149.com/images/blog-cover.jpg'
        }
      };
      
      await db.insert(pageContents).values({
        page: 'blog',
        content: JSON.stringify(blogContent),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Blog page content created successfully.');
    } else {
      console.log('Blog page content already exists.');
    }
    
    // Check if the projects page content exists
    const projectsPage = await db.query.pageContents.findFirst({
      where: eq(pageContents.page, 'projects')
    });
    
    // If not, create default projects page content
    if (!projectsPage) {
      console.log('Creating default projects page content...');
      
      const projectsContent = {
        projectsTitle: 'Projects - HAL149',
        projectsSubtitle: 'Innovative AI solutions and case studies',
        metadata: {
          title: 'AI Projects & Case Studies | HAL149',
          description: 'Discover our innovative AI implementations, machine learning solutions, and technological advancements that are transforming industries.',
          keywords: 'AI projects, machine learning case studies, artificial intelligence solutions, HAL149 innovations',
          canonical: 'https://test.hal149.com/projects/',
          ogTitle: 'HAL149 AI Projects & Case Studies',
          ogDescription: 'Real-world AI implementations and innovations transforming industries.',
          ogImage: 'https://test.hal149.com/images/projects-cover.jpg'
        }
      };
      
      await db.insert(pageContents).values({
        page: 'projects',
        content: JSON.stringify(projectsContent),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Projects page content created successfully.');
    } else {
      console.log('Projects page content already exists.');
    }
    
    console.log('Page metadata initialization completed.');
    
  } catch (error) {
    console.error('Error initializing page metadata:', error);
  }
}

// Execute the initialization
initializePageMetadata()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });