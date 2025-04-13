// netlify/functions/test-db.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // Safe logging of environment variables
  const envStatus = {
    supabaseUrl: process.env.SUPABASE_URL ? "Present (length: " + process.env.SUPABASE_URL.length + ")" : "Missing",
    supabaseKey: process.env.SUPABASE_KEY ? "Present (length: " + process.env.SUPABASE_KEY.length + ")" : "Missing",
    databaseUrl: process.env.DATABASE_URL ? "Present (length: " + process.env.DATABASE_URL.length + ")" : "Missing"
  };

  let supabaseStatus = "Not tested";
  let pageContentsData = null;
  let blogPostsCount = 0;
  let projectsCount = 0;
  let errorDetails = null;

  try {
    // Try connecting to Supabase
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    
    // Test #1: Get a single page content
    const pageResult = await supabase
      .from('page_contents')
      .select('*')
      .eq('page', 'home')
      .single();
    
    if (pageResult.error) {
      throw new Error(`Page contents query error: ${pageResult.error.message}`);
    }
    
    pageContentsData = pageResult.data;
    supabaseStatus = "Connected successfully";
    
    // Test #2: Count blog posts
    const blogResult = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact' });
    
    blogPostsCount = blogResult.count || 0;
    
    // Test #3: Count projects
    const projectResult = await supabase
      .from('projects')
      .select('id', { count: 'exact' });
    
    projectsCount = projectResult.count || 0;
  } catch (error) {
    supabaseStatus = "Connection failed";
    errorDetails = error.message;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Environment and Database Test",
      environment: envStatus,
      supabase: {
        status: supabaseStatus,
        pageContents: pageContentsData ? "Found home page content" : "No home page content found",
        blogPostsCount,
        projectsCount
      },
      error: errorDetails
    }, null, 2)
  };
};