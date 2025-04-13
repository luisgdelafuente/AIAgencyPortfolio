# Netlify Deployment Guide

## Option 1: Frontend-only Deployment

To deploy just the frontend to Netlify:

1. Set up your Netlify build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`

2. Set the following environment variables in Netlify:
   - `SUPABASE_URL`: `https://spebrqnqmrmeacntsrmp.supabase.co`
   - `SUPABASE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU`

3. For this approach, your frontend would need to call an API hosted elsewhere

## Option 2: Full Stack on Render

Render.com is better suited for full-stack applications:

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect to your GitHub repository
4. Set the build command to: `npm run build`
5. Set the start command to: `npm start`
6. Add the environment variables:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_MHfkRC4sWF2c@ep-white-hat-a50l0t0d.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - `SUPABASE_URL`: `https://spebrqnqmrmeacntsrmp.supabase.co`
   - `SUPABASE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU`

## Option 3: Create Static Version

To make a fully static version for Netlify:

1. Create versions of your components that use hardcoded data instead of API calls
2. Update your Netlify build command to build just the static site

This approach is more work but creates a fully static showcase site.