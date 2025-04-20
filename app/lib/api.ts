// API utility functions for fetching data

export async function fetchPageContent(pageName: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/page-contents/${pageName}`, {
      next: { revalidate: 60 } // Revalidate at most once per minute
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page content for ${pageName}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
}

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