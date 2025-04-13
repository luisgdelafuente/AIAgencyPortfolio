// netlify/functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Import the required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware setup
app.use(express.json());
app.use(cors());

// API routes
app.get('/api/auth/check', async (req, res) => {
  res.json({ authenticated: false });
});

// Blog routes
app.get('/api/blog', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects routes
app.get('/api/projects/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true)
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Page content routes
app.get('/api/page-contents/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const { data, error } = await supabase
      .from('page_contents')
      .select('*')
      .eq('page', page)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || { page, content: '{}' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export the serverless function
module.exports.handler = serverless(app);