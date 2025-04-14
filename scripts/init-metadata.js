/**
 * Simple script to initialize metadata pages
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv to find the .env file in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initializeMetadata() {
  const client = await pool.connect();
  
  try {
    console.log('Initializing metadata pages...');
    
    // Check if blog page exists
    const blogCheck = await client.query('SELECT * FROM page_contents WHERE page = $1', ['blog']);
    
    if (blogCheck.rows.length === 0) {
      console.log('Creating blog page metadata...');
      
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
      
      await client.query(
        'INSERT INTO page_contents (page, content, updated_at) VALUES ($1, $2, $3)',
        ['blog', JSON.stringify(blogContent), new Date().toISOString()]
      );
      
      console.log('Blog page metadata created successfully.');
    } else {
      console.log('Blog page metadata already exists.');
    }
    
    // Check if projects page exists
    const projectsCheck = await client.query('SELECT * FROM page_contents WHERE page = $1', ['projects']);
    
    if (projectsCheck.rows.length === 0) {
      console.log('Creating projects page metadata...');
      
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
      
      await client.query(
        'INSERT INTO page_contents (page, content, updated_at) VALUES ($1, $2, $3)',
        ['projects', JSON.stringify(projectsContent), new Date().toISOString()]
      );
      
      console.log('Projects page metadata created successfully.');
    } else {
      console.log('Projects page metadata already exists.');
    }
    
    console.log('Metadata initialization completed.');
    
  } catch (error) {
    console.error('Error initializing metadata:', error);
  } finally {
    client.release();
    // Close the pool and exit
    pool.end().then(() => {
      console.log('Database pool closed.');
      process.exit(0);
    });
  }
}

// Run the function
initializeMetadata();