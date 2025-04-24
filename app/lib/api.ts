// API utility functions for fetching data

// Helper function to ensure we have a valid base URL for API requests
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  // If we're in a browser environment, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // If we're in a server environment, use a default origin
  return 'http://localhost:5000';
}

export async function fetchPageContent(pageName: string) {
  try {
    const baseUrl = getBaseUrl();
    const url = new URL(`/api/page-contents/${pageName}`, baseUrl);
    
    const response = await fetch(url.toString(), {
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
    const url = new URL('/api/blog', baseUrl);
    
    const response = await fetch(url.toString(), {
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
    const url = new URL('/api/projects/featured', baseUrl);
    
    const response = await fetch(url.toString(), {
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

// Client-side API helper functions for mutations
export async function apiPost(endpoint: string, data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || response.statusText || 'An error occurred';
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function apiPut(endpoint: string, data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || response.statusText || 'An error occurred';
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function apiDelete(endpoint: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || response.statusText || 'An error occurred';
    throw new Error(errorMessage);
  }

  return response.json();
}