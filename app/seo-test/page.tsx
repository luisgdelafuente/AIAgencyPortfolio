import { Metadata } from 'next';
import { getPageContent } from '../lib/api';

// Generate dynamic metadata for this test page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('home');
  
  // Use metadata helper to extract and combine with defaults
  const { extractMetadataFromContent } = await import('../lib/metadata');
  const metadata = extractMetadataFromContent(pageContent);
  
  console.log('SEO TEST PAGE - Metadata being used:', metadata);
  
  return {
    ...metadata,
    title: 'SEO Test Page | HAL149', // Override title for this test page
  };
}

export default async function SeoTestPage() {
  // Get page content for display
  const pageContent = await getPageContent('home');
  const content = pageContent ? JSON.parse(pageContent.content) : null;
  const metadata = content?.metadata || {};
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SEO Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Metadata Verification</h2>
        <p className="mb-4">
          This page is used to verify that metadata is correctly implemented for SEO purposes.
          Check the page source to see the meta tags.
        </p>
        
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium">Current Metadata Values:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">Title:</span> 
              <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">{metadata.title || 'Not set'}</pre>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">Description:</span> 
              <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">{metadata.description || 'Not set'}</pre>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">Keywords:</span> 
              <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">{metadata.keywords || 'Not set'}</pre>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">Canonical URL:</span> 
              <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">{metadata.canonical || 'Not set'}</pre>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">OG Title:</span> 
              <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">{metadata.ogTitle || metadata.title || 'Not set'}</pre>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">OG Description:</span> 
              <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">{metadata.ogDescription || metadata.description || 'Not set'}</pre>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <span className="font-semibold">OG Image:</span> 
              <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">{metadata.ogImage || 'Not set'}</pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h3 className="text-lg font-medium mb-2">How to Verify:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Right-click on this page and select "View Page Source"</li>
            <li>Look for <code className="bg-gray-200 px-1 rounded">meta</code> tags in the <code className="bg-gray-200 px-1 rounded">head</code> section</li>
            <li>Verify that tags include title, description, OG tags, Twitter tags, etc.</li>
            <li>Confirm that the canonical URL is properly set</li>
          </ol>
        </div>
        
        {metadata.ogImage && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">OG Image Preview:</h3>
            <img 
              src={metadata.ogImage} 
              alt="OG Image preview" 
              className="border rounded-md max-w-full h-auto"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}