'use client';

import { useState } from 'react';

export default function ViewSourceClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [htmlSource, setHtmlSource] = useState('');
  const [metaTags, setMetaTags] = useState<string[]>([]);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  async function fetchSourceCode() {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Format the URL correctly
      let targetUrl = url;
      if (!url.startsWith('http') && !url.startsWith('/')) {
        targetUrl = '/' + url;
      }
      
      // Simple proxy to fetch the HTML source
      const response = await fetch(`/api/fetch-source?url=${encodeURIComponent(targetUrl)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch source: ${response.statusText}`);
      }
      
      const data = await response.text();
      setHtmlSource(data);
      
      // Extract meta tags
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      
      // Get all meta and link tags
      const metaElements = Array.from(doc.querySelectorAll('meta, link[rel="canonical"], title'));
      const extractedTags = metaElements.map(el => el.outerHTML);
      
      setMetaTags(extractedTags);
    } catch (err) {
      console.error('Error fetching source:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Failed to fetch source'}`);
      setHtmlSource('');
      setMetaTags([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">View Source Utility</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">SEO Meta Tag Checker</h2>
        <p className="mb-4">
          This utility helps verify that SEO metadata is correctly implemented in the HTML source of your pages.
        </p>
        
        <div className="mb-6">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter URL to check:
          </label>
          <div className="flex">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://hal149.com or /about"
              className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            />
            <button
              onClick={fetchSourceCode}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Fetch Source'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
        
        {metaTags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Meta Tags Found:</h3>
            <div 
              className="bg-gray-100 p-4 rounded-md overflow-auto"
              style={{ maxHeight: '300px' }}
            >
              {metaTags.map((tag, i) => (
                <div key={i} className="font-mono text-sm mb-2 p-1 bg-white rounded">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {htmlSource && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">HTML Source:</h3>
            <div 
              className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto font-mono text-sm"
              style={{ maxHeight: '500px' }}
            >
              <pre>{htmlSource}</pre>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Check SEO Tags:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Enter a URL (e.g., <code className="bg-gray-200 px-1 rounded">/</code> or <code className="bg-gray-200 px-1 rounded">/about</code>)</li>
          <li>Click "Fetch Source" to retrieve the HTML</li>
          <li>The system will extract and display meta tags and SEO elements</li>
          <li>Check for title, description, OG tags, Twitter tags, etc.</li>
          <li>Verify canonical links and other SEO essentials</li>
        </ol>
      </div>
    </div>
  );
}