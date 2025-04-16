import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createBlogPost() {
  try {
    // Read the README.md file
    const readmePath = path.join(__dirname, '../README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Read the HTML content from the plain HTML file
    const htmlPath = path.join(__dirname, '../readme-plain.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // First login to get a session
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }

    // Get cookies from login response
    const cookies = loginResponse.headers.get('set-cookie');

    // Create the blog post data
    const postData = {
      title: 'HAL149 - AI Agency Website Development',
      slug: 'hal149-ai-agency-website-development',
      excerpt: 'An overview of the HAL149 AI Agency Website project, featuring a comprehensive content management system with a focus on performance optimization and SEO.',
      content: htmlContent,
      imageUrl: 'https://test.hal149.com/images/blog-cover.jpg', // Use a dummy image URL
      publishedAt: new Date().toISOString(),
      metadata: {
        title: 'HAL149 - AI Agency Website Development | Technical Overview',
        description: 'A technical overview of the HAL149 project - a modern, performant website with comprehensive content management capabilities.',
        keywords: 'HAL149, website development, AI agency, content management, SEO optimization',
        ogTitle: 'HAL149 Website Project - Technical Documentation',
        ogDescription: 'Explore the technical architecture and features of the HAL149 AI agency website project.',
        ogImage: 'https://test.hal149.com/images/blog-cover.jpg'
      }
    };

    // Create the blog post
    console.log('Creating blog post...');
    const response = await fetch('http://localhost:5000/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create blog post: ${response.statusText}, ${errorText}`);
    }

    const result = await response.json();
    console.log('Blog post created successfully:', result);
    console.log(`View the post at: /blog/${result.slug}/`);

  } catch (error) {
    console.error('Error creating blog post:', error);
  }
}

createBlogPost();