// Node.js script to create Supabase tables
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spebrqnqmrmeacntsrmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Starting table creation in Supabase...');

  try {
    // Create users table
    console.log('Creating users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .insert([
        { 
          username: 'admin', 
          password: 'admin123' 
        }
      ])
      .select();

    if (usersError) {
      if (usersError.code === '42P01') {
        console.log('Users table does not exist. Please create it in the Supabase dashboard with these columns:');
        console.log('- id: serial primary key');
        console.log('- username: text (not null, unique)');
        console.log('- password: text (not null)');
      } else {
        console.error('Error with users table:', usersError.message);
      }
    } else {
      console.log('Users table exists and admin user created:', usersData);
    }

    // Create blog_posts table
    console.log('\nCreating blog_posts table...');
    const { data: blogData, error: blogError } = await supabase
      .from('blog_posts')
      .insert([
        { 
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          excerpt: 'This is a test blog post',
          content: 'This is the content of the test blog post',
          image_url: 'https://example.com/image.jpg',
          published_at: new Date().toISOString()
        }
      ])
      .select();

    if (blogError) {
      if (blogError.code === '42P01') {
        console.log('Blog posts table does not exist. Please create it in the Supabase dashboard with these columns:');
        console.log('- id: serial primary key');
        console.log('- title: text (not null)');
        console.log('- slug: text (not null, unique)');
        console.log('- excerpt: text (not null)');
        console.log('- content: text (not null)');
        console.log('- image_url: text (not null)');
        console.log('- published_at: text (not null)');
      } else {
        console.error('Error with blog_posts table:', blogError.message);
      }
    } else {
      console.log('Blog posts table exists and test post created:', blogData);
    }

    // Create projects table
    console.log('\nCreating projects table...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .insert([
        { 
          title: 'Test Project',
          slug: 'test-project',
          description: 'This is a test project',
          content: 'This is the content of the test project',
          category: 'Test',
          image_url: 'https://example.com/image.jpg',
          is_featured: true
        }
      ])
      .select();

    if (projectsError) {
      if (projectsError.code === '42P01') {
        console.log('Projects table does not exist. Please create it in the Supabase dashboard with these columns:');
        console.log('- id: serial primary key');
        console.log('- title: text (not null)');
        console.log('- slug: text (not null, unique)');
        console.log('- description: text (not null)');
        console.log('- content: text (not null)');
        console.log('- category: text (not null)');
        console.log('- image_url: text (not null)');
        console.log('- is_featured: boolean (default false)');
      } else {
        console.error('Error with projects table:', projectsError.message);
      }
    } else {
      console.log('Projects table exists and test project created:', projectsData);
    }

    // Create waitlist table
    console.log('\nCreating waitlist table...');
    const { data: waitlistData, error: waitlistError } = await supabase
      .from('waitlist')
      .insert([
        { 
          email: 'test@example.com'
        }
      ])
      .select();

    if (waitlistError) {
      if (waitlistError.code === '42P01') {
        console.log('Waitlist table does not exist. Please create it in the Supabase dashboard with these columns:');
        console.log('- id: serial primary key');
        console.log('- email: text (not null, unique)');
        console.log('- submitted_at: timestamp with time zone (default: now())');
      } else {
        console.error('Error with waitlist table:', waitlistError.message);
      }
    } else {
      console.log('Waitlist table exists and test entry created:', waitlistData);
    }

    console.log('\nTable creation/check complete. If you received errors, please create the tables manually in the Supabase dashboard.');
    console.log('SQL Statements for manual table creation:');
    console.log(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  published_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    `);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTables();