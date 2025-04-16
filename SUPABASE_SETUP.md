# Supabase Database Setup

This document provides instructions for setting up the Supabase database for the AI Agency Website project.

## Prerequisites

- Access to the Supabase project dashboard
- Supabase project URL and API key (already configured in the application)

## Table Structure

The application requires the following tables to be created in Supabase:

1. **users** - Stores admin user credentials
2. **blog_posts** - Stores blog articles
3. **projects** - Stores project information
4. **waitlist** - Stores email addresses from waitlist signups

## Setup Instructions

1. **Log in to your Supabase dashboard**:
   - Go to [https://app.supabase.com/](https://app.supabase.com/)
   - Navigate to your project

2. **Create the database tables**:
   - Click on the "SQL Editor" tab
   - Create a new query
   - Copy and paste the following SQL code:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  published_at TEXT NOT NULL
);

-- Create projects table
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

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create default admin user
INSERT INTO users (username, password)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;
```

3. **Run the SQL query** by clicking the "Run" button

## Seed Initial Data

After creating the tables, you can seed them with initial data:

1. Run the `scripts/seed-data.js` script from your project root:
   ```
   node scripts/seed-data.js
   ```

This will populate the database with sample blog posts and projects.

## Verification

After setup, you can verify the tables were created correctly:

1. In the Supabase dashboard, go to the "Table Editor" tab
2. You should see all four tables listed: users, blog_posts, projects, and waitlist
3. Click on each table to verify the columns were created correctly
4. The "users" table should contain one row with the username "admin"

## Troubleshooting

If the application can't connect to Supabase:

1. Verify the Supabase URL and key in `server/supabase.ts`
2. Check if all the required tables exist in your Supabase project
3. Ensure table permissions are set correctly (Public access for the application)