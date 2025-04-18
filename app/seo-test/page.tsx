import { Metadata } from 'next';

// Generate fixed metadata for testing
export const metadata: Metadata = {
  title: 'SEO Test Page | HAL149',
  description: 'This page is for testing SEO and meta tags',
  keywords: 'seo, testing, metadata, hal149',
  openGraph: {
    title: 'SEO Test Page | HAL149',
    description: 'This page is for testing SEO and meta tags',
    url: 'https://hal149.com/seo-test',
    siteName: 'HAL149',
    images: [
      {
        url: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
        width: 480,
        height: 480,
        alt: 'HAL149 Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Test Page | HAL149',
    description: 'This page is for testing SEO and meta tags',
    images: ['https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'],
  },
};

// Simple component that displays metadata info
export default function SEOTestPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">SEO Test Page</h1>
      
      <div className="prose">
        <p className="text-lg mb-6">
          This page demonstrates how Next.js handles metadata and SEO tags. View the page source to see all the meta tags that have been generated.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Included Metadata:</h2>
        
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="font-bold mb-2">Basic Metadata:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Title: <code>SEO Test Page | HAL149</code></li>
            <li>Description: <code>This page is for testing SEO and meta tags</code></li>
            <li>Keywords: <code>seo, testing, metadata, hal149</code></li>
          </ul>
          
          <h3 className="font-bold mb-2">Open Graph Tags:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>og:title: <code>SEO Test Page | HAL149</code></li>
            <li>og:description: <code>This page is for testing SEO and meta tags</code></li>
            <li>og:url: <code>https://hal149.com/seo-test</code></li>
            <li>og:type: <code>website</code></li>
            <li>og:image: <code>https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp</code></li>
          </ul>
          
          <h3 className="font-bold mb-2">Twitter Tags:</h3>
          <ul className="list-disc pl-6">
            <li>twitter:card: <code>summary_large_image</code></li>
            <li>twitter:title: <code>SEO Test Page | HAL149</code></li>
            <li>twitter:description: <code>This page is for testing SEO and meta tags</code></li>
            <li>twitter:image: <code>https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp</code></li>
          </ul>
        </div>
        
        <div className="mt-8 p-6 border border-yellow-300 bg-yellow-50 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">How to View the Meta Tags:</h3>
          <p>
            Right-click on this page and select "View Page Source" to see all the meta tags that Next.js has generated for this page.
          </p>
          <p className="mt-2">
            These meta tags will be properly indexed by search engines, unlike the previous SPA implementation where search engines wouldn't see dynamically generated content.
          </p>
        </div>
      </div>
    </div>
  );
}