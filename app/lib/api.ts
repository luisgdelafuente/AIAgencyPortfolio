import { BlogPost, Project, PageContent } from '../../shared/schema';
import { getSupabase } from './supabase';

// Fetch page content by page name
export async function getPageContent(page: string): Promise<PageContent | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('page_contents')
    .select('*')
    .eq('page', page)
    .single();
  
  if (error) {
    console.error(`Error fetching page content for ${page}:`, error);
    return null;
  }
  
  return data as PageContent;
}

// Fetch all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  
  return data as BlogPost[];
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
  
  return data as BlogPost;
}

// Fetch all projects
export async function getAllProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data as Project[];
}

// Fetch featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('id', { ascending: false });
  
  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
  
  return data as Project[];
}

// Fetch a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
  
  return data as Project;
}