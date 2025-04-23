// API utility functions for fetching data

// Get the base URL for API requests
const getBaseUrl = () => {
  // For server-side requests in development
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }
  // For client-side requests, use relative URL
  return '';
};

export async function fetchPageContent(pageName: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/page-contents/${pageName}`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/blog`, {
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
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/projects/featured`, {
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