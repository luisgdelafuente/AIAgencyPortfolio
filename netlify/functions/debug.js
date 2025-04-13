// netlify/functions/debug.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  console.log('Debug function called');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  
  const response = {
    message: "Netlify Environment Debug",
    requestInfo: {
      path: event.path,
      httpMethod: event.httpMethod,
      headers: event.headers,
      queryStringParameters: event.queryStringParameters,
    },
    environment: {
      supabaseUrl: supabaseUrl ? `Present (length: ${supabaseUrl.length})` : 'Missing',
      supabaseKey: supabaseKey ? `Present (length: ${supabaseKey.length})` : 'Missing',
      databaseUrl: databaseUrl ? `Present (length: ${databaseUrl.length})` : 'Missing',
      nodeEnv: process.env.NODE_ENV || 'Not set',
    },
    timestamp: new Date().toISOString()
  };
  
  // Try to connect to Supabase if credentials are present
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection by fetching home page content
      const { data: homeContent, error: homeError } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page', 'home')
        .single();
        
      // Test connection by fetching blog posts
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('*');
        
      response.supabaseConnection = {
        connected: !homeError && !blogError,
        homeContent: homeContent ? 'Found' : 'Not found',
        blogPostsCount: blogPosts?.length || 0,
        errors: {
          homeError: homeError?.message || null,
          blogError: blogError?.message || null
        }
      };
    } catch (error) {
      response.supabaseConnection = {
        connected: false,
        error: error.message
      };
    }
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(response, null, 2)
  };
};