import { supabase } from './supabase';

export async function createTables() {
  console.log('Checking if Supabase tables exist...');

  try {
    // Check if users table exists
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.log('Users table does not exist or is not accessible');
      // Create users table
      const { error: createUsersError } = await supabase.rpc('create_users_table');
      if (!createUsersError) {
        console.log('Created users table successfully');
      }
    } else {
      console.log('Users table exists');
    }

    // Check if blog_posts table exists
    const { data: blogData, error: blogError } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);
    
    if (blogError) {
      console.log('Blog posts table does not exist or is not accessible');
      // Create blog_posts table
      const { error: createBlogError } = await supabase.rpc('create_blog_posts_table');
      if (!createBlogError) {
        console.log('Created blog_posts table successfully');
      }
    } else {
      console.log('Blog posts table exists');
    }

    // Check if projects table exists
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectsError) {
      console.log('Projects table does not exist or is not accessible');
      // Create projects table
      const { error: createProjectsError } = await supabase.rpc('create_projects_table');
      if (!createProjectsError) {
        console.log('Created projects table successfully');
      }
    } else {
      console.log('Projects table exists');
    }

    // Check if waitlist table exists
    const { data: waitlistData, error: waitlistError } = await supabase
      .from('waitlist')
      .select('id')
      .limit(1);
    
    if (waitlistError) {
      console.log('Waitlist table does not exist or is not accessible');
      // Create waitlist table
      const { error: createWaitlistError } = await supabase.rpc('create_waitlist_table');
      if (!createWaitlistError) {
        console.log('Created waitlist table successfully');
      }
    } else {
      console.log('Waitlist table exists');
    }
    
    // Check if page_contents table exists
    const { data: pageContentsData, error: pageContentsError } = await supabase
      .from('page_contents')
      .select('id')
      .limit(1);
    
    if (pageContentsError) {
      console.log('Page contents table does not exist or is not accessible');
      // Create page_contents table
      const { error: createPageContentsError } = await supabase.rpc('create_page_contents_table');
      if (!createPageContentsError) {
        console.log('Created page_contents table successfully');
      }
    } else {
      console.log('Page contents table exists');
    }
    
    // Check if contact_messages table exists
    const { data: contactMessagesData, error: contactMessagesError } = await supabase
      .from('contact_messages')
      .select('id')
      .limit(1);
    
    if (contactMessagesError) {
      console.log('Contact messages table does not exist or is not accessible');
      // Create contact_messages table
      const { error: createContactMessagesError } = await supabase.rpc('create_contact_messages_table');
      if (!createContactMessagesError) {
        console.log('Created contact_messages table successfully');
      }
    } else {
      console.log('Contact messages table exists');
    }

    console.log('Table check completed. Tables need to be created manually in Supabase dashboard if they don\'t exist.');
    console.log('Table structure:');
    console.log('- users: id, username, password');
    console.log('- blog_posts: id, title, slug, excerpt, content, image_url, published_at');
    console.log('- projects: id, title, slug, description, content, category, image_url, is_featured');
    console.log('- waitlist: id, email, submitted_at');
    console.log('- page_contents: id, page, content, updated_at');
    console.log('- contact_messages: id, name, email, subject, message, submitted_at, read');

  } catch (error) {
    console.error('Error checking/creating tables:', error);
  }
}