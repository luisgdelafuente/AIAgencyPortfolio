import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spebrqnqmrmeacntsrmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTablesWithSQL() {
  console.log('Creating tables using SQL...');

  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  // Create blog_posts table
  const createBlogPostsTable = `
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT NOT NULL,
      published_at TEXT NOT NULL
    );
  `;

  // Create projects table
  const createProjectsTable = `
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
  `;

  // Create waitlist table
  const createWaitlistTable = `
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `;

  try {
    // Note: With Supabase free tier we can't execute raw SQL through the client directly.
    // We would need to use the Supabase dashboard SQL editor to execute these commands.
    
    console.log('Tables need to be created manually in the Supabase dashboard.');
    console.log('Please copy and run the following SQL commands in the Supabase SQL editor:');
    console.log('\n--- SQL Commands ---\n');
    console.log(createUsersTable);
    console.log(createBlogPostsTable);
    console.log(createProjectsTable);
    console.log(createWaitlistTable);
    
    // Insert the default admin user
    console.log('\nAfter creating tables, insert the admin user:');
    console.log(`
      INSERT INTO users (username, password)
      VALUES ('admin', 'admin123')
      ON CONFLICT (username) DO NOTHING;
    `);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTablesWithSQL();