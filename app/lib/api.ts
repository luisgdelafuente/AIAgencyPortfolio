// API utility functions for fetching data

/**
 * Fetch page content from backend
 * This is used for page metadata, hero sections, etc.
 */
export async function fetchPageContent(pageName: string) {
  try {
    // For metadata critical requests, always use cache: 'no-store' to ensure fresh data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/page-contents/${pageName}`, {
      cache: 'no-store', // Forces a fetch request every time, guaranteeing fresh data
      headers: {
        'x-metadata-request': 'true' // Signal that this is a metadata request
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page content for ${pageName}`);
    }
    
    const data = await response.json();
    
    // Debug output to help troubleshoot metadata issues
    if (pageName.includes('home') || pageName.includes('global')) {
      console.log(`Fetched metadata for ${pageName}:`, JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
}

/**
 * Fetch all blog posts
 * Used on the blog list page
 */
export async function fetchBlogPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/blog`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a specific blog post by slug
 * Critical for dynamic page metadata on blog posts
 */
export async function fetchBlogPostBySlug(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/blog/${slug}`, {
      cache: 'no-store', // Important for SEO to ensure fresh content
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch blog post with slug: ${slug}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Fetch featured projects
 * Used on the homepage
 */
export async function fetchFeaturedProjects() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/projects/featured`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured projects');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

/**
 * Fetch all projects
 * Used on the projects list page
 */
export async function fetchProjects() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/projects`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Fetch a specific project by slug
 * Critical for dynamic page metadata on project pages
 */
export async function fetchProjectBySlug(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/projects/${slug}`, {
      cache: 'no-store', // Important for SEO to ensure fresh content
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch project with slug: ${slug}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}