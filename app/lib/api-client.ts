/**
 * Client-side API utilities for interacting with the server
 */

const API_BASE_URL = '/api';

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

// API functions
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return fetchAPI('contact-messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function joinWaitlist(email: string) {
  return fetchAPI('waitlist', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function searchContent(query: string) {
  return fetchAPI(`search?q=${encodeURIComponent(query)}`);
}

// Export the generic fetch function for custom needs
export { fetchAPI };